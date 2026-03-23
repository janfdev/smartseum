CREATE TYPE "public"."user_status" AS ENUM('pending', 'active', 'banned');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'pending' NOT NULL;