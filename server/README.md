# 🛠 Revline Backend

This is the backend of **Revline**, powering the GraphQL API, media proxying, Stripe integrations, and core business logic. Built in **Go**, it uses modern libraries like **Uber FX** for dependency injection, **Chi** for HTTP routing, and **Ent** as the ORM.

## ⚙️ Tech Stack

| Tool/Library | Purpose                                         |
| ------------ | ----------------------------------------------- |
| **Go**       | Primary language                                |
| **Uber FX**  | DI container + lifecycle management             |
| **Chi**      | HTTP router and middleware                      |
| **GQLGen**   | Codegen-based GraphQL schema & resolvers        |
| **Ent**      | ORM with GraphQL integration (entgql extension) |
| **Atlas**    | Database schema migrations                      |
| **Stripe**   | Payments & payouts via Stripe Connect           |
| **S3**       | Object storage for images and media             |

## 📁 Project Structure

```bash
backend/
├── auth/              # Auth middleware, helpers for current user retrieval
├── ent/               # Ent ORM code
│   ├── schema/        # Ent schema definitions
│   ├── entc.go        # Entrypoint for codegen with entgql extension
│   └── ...            # Generated Ent files
├── graph/             # GraphQL API layer
│   ├── directives/    # Custom GraphQL directives
│   ├── graphfx/       # FX module to register schema, resolvers, routes
│   ├── model/         # GQLGen-generated models
│   ├── *.graphqls     # GraphQL schema files
│   ├── *.resolvers.go # Resolver implementations
│   ├── ent.graphqls   # Ent-generated schema extension
│   └── ent.resolvers.go # Resolvers mapped to Ent
├── httpfx/            # HTTP server w/ Chi, CORS, middleware, DI registration
├── internal/          # Utilities and config
│   ├── config.go      # Env-based config loader
│   └── image.go       # PNG/WEBP image conversion helpers
├── media/             # S3 media proxy routes for stable public URLs
├── payments/          # Stripe & Connect webhooks
└── storage/           # S3 client registration for FX container
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
go mod tidy
```

### 2. Generate Ent + GraphQL

```bash
# Run Ent codegen
go generate ./ent

# Run GQLGen
go generate ./graph
```

### 4. Run the server

```bash
go run main.go
```

The server will:

* Start the Chi HTTP server via `httpfx`
* Register routes from GraphQL, media, payments via FX modules
* Expose GraphQL endpoint at `/graphql` and Playground at `/playground`

## 📦 Uploads & Media

* **User-uploaded media**: uploaded directly to S3 via pre-signed URLs
* **Public access**: proxied through `/media/:id` for caching and stable URLs
* **Optimized delivery**: Enables use of `next/image` on the frontend

## 🧾 Payments

* Stripe integration via **webhooks**
* Stripe Connect used to handle affiliate payments

## 🔐 Authentication

* Auth is enforced via middleware in `auth/`
* Current user extracted from context, used in GraphQL resolvers

## 🧩 Modular Design (FX)

Each module (GraphQL, HTTP, media, storage, etc.) registers itself into the global Uber FX container, making it easy to:

* Add new features with scoped dependencies
* Start/stop lifecycle components cleanly via `fx.Hook`

## 🤝 Contributing

We welcome contributions and improvements!

## ⚖️ License

AGPLv3 License — see [LICENSE](../LICENSE)

---

Made with ❤️ and Go
