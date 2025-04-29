package auth

import "go.uber.org/fx"

var Module = fx.Module("auth",
	fx.Invoke(RegisterMiddleware),
)
