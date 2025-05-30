package internal

import (
	"github.com/Dan6erbond/revline/ent/subscription"
	"github.com/golang-jwt/jwt/v5"
)

type LicenseClaims struct {
	Tier subscription.Tier `json:"license_tier"`
	jwt.RegisteredClaims
}
