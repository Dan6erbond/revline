package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/ent/user"
	"github.com/Dan6erbond/revline/internal"
	goJwt "github.com/golang-jwt/jwt/v5"
	"github.com/hashicorp/cap/jwt"
	"go.uber.org/zap"
)

var userCtxKey = &contextKey{"user"}

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

			tokenString := strings.Split(token[0], " ")[1]

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

				ctx := context.WithValue(r.Context(), userCtxKey, user)
				r = r.WithContext(ctx)
			}

			next.ServeHTTP(w, r)
		})
	}, nil
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
