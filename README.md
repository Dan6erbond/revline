# 🏁 Revline 1

**Built for DIY Mechanics & Car Enthusiasts**

Track your builds. Show off your rides. Stay ahead in your garage with the all-in-one app for car lovers.

## 🧰 Features

Revline helps car enthusiasts take control of every aspect of their automotive journey:

- **Fuel Logs:** Track fill-ups, fuel efficiency, and cost over time.
- **Maintenance & Service:** Log services, set reminders, and manage your garage like a pro.
- **Odometer Tracking:** Automatically track mileage history across all your builds.
- **Dyno Sessions:** Store torque & horsepower curves with RPM-based charts.
- **Drag Logs:** Record your quarter-mile runs, 0-60s, and more.
- **Media Gallery:** Upload and organize images/videos from builds, shows, and track days.
- **Documents:** Securely store service receipts, build sheets, and PDFs.

## 🎞️ Tech Stack

| Frontend                                 | Backend                                 | Infrastructure   |
| ---------------------------------------- | --------------------------------------- | ---------------- |
| Next.js                                  | Go (Fx)                                 | Docker           |
| Apollo Client                            | [GQLGen](https://gqlgen.com/) (GraphQL) | Postgres + MinIO |
| [Tailwind CSS](https://tailwindcss.com/) | [Ent](https://entgo.io/) (ORM)          | Docker Compose   |
| [HeroUI](https://www.heroui.com/)        |                                         |                  |

🧑‍💻 Repository Structure

```bash
revline/
├── client/ # Next.js frontend with Apollo Client
├── server/ # Go backend using Fx, gqlgen, ent
├── docker-compose.yml # Dev infra (Postgres, MinIO only)
├── sample-docker-compose.yml # Self-hosting reference
└── README.md
```

## 🚀 Getting Started (Dev Environment)

### Prerequisites

- Docker + Docker Compose
- Node.js (v18+)
- Go (v1.24+)

### 1. Clone the Repository

```bash
git clone https://github.com/dan6erbond/revline.git
cd revline
```

### 2. Start Infrastructure (Database & MinIO)

```bash
docker-compose up
```

This starts:

- Postgres (on port 5432)
- MinIO (S3-compatible storage, port 9000)
- MinIO Console (port 9001)

### 3. Configure Backend

Create a `config.yaml` file in `server/` based on the example config.

```bash
cp server/config.example.yaml server/config.yaml
```

### 4. Run Backend

```bash
cd server
go run main.go
```

### 5. Configure Frontend

Create a `.env.local` file in `client/`:

```bash
cp client/.env.example client/.env.local
```

### 6. Generate GraphQL Types (Frontend)

```bash
cd client
npm install
npm run codegen
```

### 7. Run Frontend

```bash
npm run dev
```

Access the app at http://localhost:3000

### 8. Access MinIO (for local media)

Console: http://localhost:9001

Access Key: `minioadmin`

Secret Key: `minioadmin`

## 🌐 Hosted App

Use the hosted version of Revline at https://revline.one — the easiest way to get started and benefit from upcoming features like discovering and sharing builds with the community.

Product Hunt: [Revline 1 - Track your build, not just your miles](https://www.producthunt.com/posts/revline-1)

## 🏠 Self-Hosting

Self-hosting is available for users who prefer to run Revline 1 independently. A commercial server license must be purchased to enable additional features from the [selfhosted page](https://revline.one/selfhosted). It provides the same feature set as the SaaS version and is valid for all users of the self-hosted instance.

To set up:

```bash
docker-compose -f sample-docker-compose.yml up -d
```

For more information on self-hosting, see the [Self-Hosting Guide](https://revline.one/selfhosted).

> 🔐 Update passwords and access keys before using in production.

## 📥 Contributing

We welcome contributions:

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

## 🛠 Roadmap Highlights

- **Build Logs**
Track individual modifications, wraps, repairs, and installations over time — complete with media, notes, and costs.
- **Public Profiles**
Showcase your garage with public profiles for users and their cars. Includes build history, photo galleries, performance upgrades, planned mods, event history, and more.
- **Verified Badges**
Earn profile badges through event participation via partner integrations like VeloMeet.
- **Notifications**
Email and push notifications for service reminders, inspection dates, or fully custom alerts.
- **Smart Scanning**
AI-based OCR for scanning and parsing service receipts, dyno graphs, and track slips — making logging effortless.
- **Community Features**
Discover other builds, follow your favorite garages, and engage with a growing community of enthusiasts.



## ⚖️ License

AGPLv3 License — see [LICENSE](./LICENSE)

---

Made with 🛠️ in the garage.
