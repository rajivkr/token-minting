# Token Minting

## Bringing the app in Prod mode using single command

```bash
docker-compose up -d
```

## OR

## Local Development

- Using values in `.env` (checking in as this is sample project, don't check-in any secret here)

### Setup for database alone in docker if needed

```bash
docker-compose -f docker-compose-db-only up -d
```

### Installation for both frontend & backend after postgres setup for local development

```bash
yarn install
```

### Setting up the database migrations

```bash
# prisma init
yarn prisma:migrate-dev
```

### Running the server and frontend in watch mode

```bash
yarn dev:all
```
