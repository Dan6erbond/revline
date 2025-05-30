package auth

import (
	"context"
	"crypto/rsa"
	"crypto/x509"
	_ "embed"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net/http"
	"strings"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/ent/subscription"
	"github.com/Dan6erbond/revline/ent/user"
	"github.com/Dan6erbond/revline/internal"
	goJwt "github.com/golang-jwt/jwt/v5"
	"github.com/hashicorp/cap/jwt"
	"go.uber.org/zap"
)

var userCtxKey = &contextKey{"user"}

//go:embed public.pem
var keyData []byte

type contextKey struct {
	name string
}

type oidcProvider struct {
	Name       string
	IssuerURL  string
	EmailClaim string
	KeySet     jwt.KeySet
}

func Middleware(entClient *ent.Client, config internal.Config, logger *zap.Logger) (func(http.Handler) http.Handler, error) {
	ctx := context.Background()

	providers := []oidcProvider{}

	for _, p := range config.Auth.Providers {
		switch p.Type {
		case "oidc":
			keySet, err := jwt.NewOIDCDiscoveryKeySet(ctx, p.IssuerURL, "")

			if err != nil {
				return nil, err
			}

			providers = append(providers, oidcProvider{p.Name, p.IssuerURL, p.EmailClaim, keySet})
		}
	}

	parser := goJwt.NewParser()

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger.Info("Running auth guard")

			token, ok := r.Header["Authorization"]

			if !ok || len(token) == 0 {
				next.ServeHTTP(w, r)

				return
			}

			parts := strings.Split(token[0], " ")

			if len(parts) < 2 {
				next.ServeHTTP(w, r)

				return
			}

			tokenString := parts[1]

			t, _, err := parser.ParseUnverified(tokenString, goJwt.MapClaims{})

			if err != nil {
				logger.Error("Error parsing token", zap.Error(err))

				w.WriteHeader(http.StatusBadRequest)
				enc := json.NewEncoder(w)
				err = enc.Encode(struct {
					Error string `json:"error"`
				}{
					Error: "Invalid token",
				})

				return
			}

			for _, p := range providers {
				if issuer, err := t.Claims.GetIssuer(); err != nil || issuer != p.IssuerURL {
					if err != nil {
						w.WriteHeader(http.StatusBadRequest)
						enc := json.NewEncoder(w)
						err = enc.Encode(struct {
							Error string `json:"error"`
						}{
							Error: "Invalid token",
						})

						return
					}

					continue
				}

				claims, err := p.KeySet.VerifySignature(r.Context(), tokenString)
				if err != nil {
					logger.Error("Error parsing token", zap.Error(err))

					w.WriteHeader(http.StatusForbidden)
					enc := json.NewEncoder(w)
					err = enc.Encode(struct {
						Error string `json:"error"`
					}{
						Error: "Invalid token",
					})

					if err != nil {
						logger.Error("Error encoding response", zap.Error(err))
					}

					return
				}

				email := claims[p.EmailClaim].(string)

				user, err := entClient.User.Query().Where(user.EmailEQ(email)).First(r.Context())

				if err != nil && !ent.IsNotFound(err) {
					logger.Error("Error querying user", zap.Error(err))

					w.WriteHeader(http.StatusInternalServerError)
					enc := json.NewEncoder(w)
					err = enc.Encode(struct {
						Error string `json:"error"`
					}{
						Error: "Internal error",
					})

					if err != nil {
						logger.Error("Error encoding response", zap.Error(err))
					}

					return
				} else if ent.IsNotFound(err) {
					user, err = entClient.User.
						Create().
						SetEmail(email).
						Save(r.Context())

					if err != nil {
						logger.Error("Error querying user", zap.Error(err))

						w.WriteHeader(http.StatusInternalServerError)
						enc := json.NewEncoder(w)
						err = enc.Encode(struct {
							Error string `json:"error"`
						}{
							Error: "Internal error",
						})

						if err != nil {
							logger.Error("Error encoding response", zap.Error(err))
						}

						return
					}
				}

				if err := assignSubscription(r.Context(), config, entClient, user); err != nil {
					logger.Warn("Error assigning subscription", zap.Error(err))
				}

				ctx := context.WithValue(r.Context(), userCtxKey, user)
				r = r.WithContext(ctx)
			}

			next.ServeHTTP(w, r)
		})
	}, nil
}

func assignSubscription(ctx context.Context, config internal.Config, entClient *ent.Client, user *ent.User) error {
	if config.LicenseKey != "" {
		block, _ := pem.Decode(keyData)
		if block == nil || block.Type != "PUBLIC KEY" {
			return fmt.Errorf("invalid PEM block type: expected PUBLIC KEY")
		}

		pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
		if err != nil {
			return fmt.Errorf("parsing public key: %w", err)
		}

		pubKey, ok := pubInterface.(*rsa.PublicKey)
		if !ok {
			return fmt.Errorf("not an RSA public key")
		}

		token, err := goJwt.ParseWithClaims(config.LicenseKey, &internal.LicenseClaims{}, func(token *goJwt.Token) (interface{}, error) {
			return pubKey, nil
		})
		if err != nil {
			return err
		}

		claims, ok := token.Claims.(*internal.LicenseClaims)

		if !ok || !token.Valid {
			return fmt.Errorf("invalid token")
		}

		sub, err := user.QuerySubscriptions().
			Where(
				subscription.StatusIn("active", "trialing"),
			).
			First(ctx)

		if err != nil {
			if ent.IsNotFound(err) {
				_, err := entClient.Subscription.Create().
					SetTier(claims.Tier).
					SetStatus(subscription.StatusActive).
					Save(ctx)

				if err != nil {
					return err
				}

				return nil
			}

			return err
		}

		if _, err := sub.Update().
			SetStatus(subscription.StatusActive).
			SetTier(claims.Tier).
			Save(ctx); err != nil {
			return err
		}
	}

	return nil
}

func ForContext(ctx context.Context) *ent.User {
	raw, _ := ctx.Value(userCtxKey).(*ent.User)

	return raw
}

func NewMiddleware(entClient *ent.Client, config internal.Config, logger *zap.Logger) (func(http.Handler) http.Handler, error) {
	mw, err := Middleware(entClient, config, logger.Named("middleware"))

	if err != nil {
		return nil, err
	}

	return mw, nil
}
