# BUILD FOR LOCAL DEVELOPMENT
FROM node:18-alpine As development

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
COPY frontend ./frontend/

# Install app dependencies
RUN yarn install

ARG DATABASE_URL
ARG JWT_SECRET
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

# Initiate Primsa
RUN yarn prisma:migrate-dev

# BUILD FOR PRODUCTION
FROM node:16 AS builder

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
COPY frontend ./frontend/

# Install app dependencies
RUN yarn install

COPY . .

RUN  yarn run build

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD [ "yarn", "start:prod" ]