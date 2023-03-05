# BUILD FOR LOCAL DEVELOPMENT
FROM node:18-alpine

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

EXPOSE 3000

RUN yarn build