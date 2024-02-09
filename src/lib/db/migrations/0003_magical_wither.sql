DO $$ BEGIN
 CREATE TYPE "importance_tag" AS ENUM('HIGH', 'MEDIUM', 'LOW');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_requests" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"from_client_user_id" varchar(256) NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"email" text,
	"counter" integer NOT NULL,
	"fields" jsonb,
	"importance_type" "importance_tag" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liaison_requests" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"from_liaison_user_id" varchar NOT NULL,
	"origininating_client_request_id" varchar,
	"forwarded_to_supplier_id" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_from_client_user_id_user_id_fk" FOREIGN KEY ("from_client_user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_requests" ADD CONSTRAINT "liaison_requests_from_liaison_user_id_user_id_fk" FOREIGN KEY ("from_liaison_user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_requests" ADD CONSTRAINT "liaison_requests_origininating_client_request_id_client_requests_id_fk" FOREIGN KEY ("origininating_client_request_id") REFERENCES "client_requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_requests" ADD CONSTRAINT "liaison_requests_forwarded_to_supplier_id_companies_id_fk" FOREIGN KEY ("forwarded_to_supplier_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
