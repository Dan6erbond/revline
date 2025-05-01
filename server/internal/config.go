package internal

import "github.com/spf13/viper"

type Config struct {
	DatabaseURL string
	Host        string
	Port        uint
	Environment string
	Auth        struct {
		Providers []struct {
			Name       string
			Type       string
			EmailClaim string
			IssuerURL  string
		}
	}
	S3 struct {
		Endpoint        string
		Bucket          string
		AccessKey       string
		SecretAccessKey string
		UseSSL          bool
		Region          string
	}
	Stripe struct {
		SecretKey     string
		WebhookSecret string
		Products      struct {
			DIY        Product
			Enthusiast Product
		}
	}
	PublicURL string
}

type Product struct {
	ID     string
	Prices struct {
		Monthly Price
	}
}

type Price struct {
	ID string
}

func SetDefaults() {
	viper.SetDefault("host", "localhost")
	viper.SetDefault("port", 4000)
	viper.SetDefault("environment", "development")
}
