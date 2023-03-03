# Local Development

## Database setup

- Please change the `DATABASE_URL` in `.env` if you are running postgres seperately instead of docker.
- Using values in `.env` (checking in as this is sample project, don't check any secret here)

## Bringing up the Database

```bash
docker-compose up -d
```

## Installation for both frontend & backend

```bash
yarn install
```

## Setting up the database migrations

```bash
# prisma init
yarn prisma:dev
```

## Running the server and frontend

```bash
yarn dev:all
```
