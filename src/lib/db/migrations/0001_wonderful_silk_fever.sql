DO $$ BEGIN
 CREATE TYPE "company_type" AS ENUM('CLIENT', 'SUPPLIER', 'LIAISON');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company_type" "company_type" NOT NULL,
	"email" text,
	"phone_number" text,
	"website_url" text,
	"billing_address" text,
	"shipping_address" text,
	"domains" json,
	"passphrase" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
