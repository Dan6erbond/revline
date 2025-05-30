package internal

import (
	"fmt"
	"net/url"

	"github.com/spf13/viper"
)

type Config struct {
	DatabaseURL string
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
		SecretKey            string
		WebhookSecret        string
		ConnectWebhookSecret string
		Products             struct {
			DIY        Product
			Enthusiast Product
		}
	}
	Server struct {
		Host      string
		Port      uint
		PublicURL string
	}
	PublicURL  string
	LicenseKey string
}

func (c Config) GetServerPublicURL() (u *url.URL, err error) {
	if c.Server.PublicURL == "" {
		return url.Parse(fmt.Sprintf("http://%s:%d", c.Server.Host, c.Server.Port))
	}

	return url.Parse(c.Server.PublicURL)
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

func setDefaults() {
	viper.SetDefault("server.host", "localhost")
	viper.SetDefault("server.port", 4000)
	viper.SetDefault("environment", "development")
}

func ParseConfig() (config Config, err error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	viper.AutomaticEnv()

	setDefaults()

	if err = viper.ReadInConfig(); err != nil {
		return
	}

	if err = viper.Unmarshal(&config); err != nil {
		return
	}

	return
}
