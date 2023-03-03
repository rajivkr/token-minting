-- CreateEnum
CREATE TYPE "UserAccountType" AS ENUM ('USER', 'OWNER');

-- CreateEnum
CREATE TYPE "Chains" AS ENUM ('BITCOIN', 'ETHEREUM', 'SOLANA', 'POLYGON', 'AVALANCHE', 'FANTOM', 'BSC');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Networks" AS ENUM ('MAINNET', 'TESTNET', 'KOVAN', 'GOERLI', 'MUMBAI', 'ROPSTEN', 'RINKEBY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "address" TEXT NOT NULL,
    "chain" "Chains" NOT NULL DEFAULT 'ETHEREUM',
    "network" "Networks" NOT NULL DEFAULT 'MAINNET',
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "account_type" "UserAccountType" NOT NULL DEFAULT 'USER',
    "server_metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balances" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_name" TEXT NOT NULL,
    "token_symbol" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledgers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "receiver_address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "txn_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "balances_user_id_idx" ON "balances"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "balances_token_name_token_symbol_user_id_key" ON "balances"("token_name", "token_symbol", "user_id");

-- CreateIndex
CREATE INDEX "ledgers_user_id_idx" ON "ledgers"("user_id");

-- AddForeignKey
ALTER TABLE "balances" ADD CONSTRAINT "balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
