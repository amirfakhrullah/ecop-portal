DO $$ BEGIN
 CREATE TYPE "team_role_type" AS ENUM('CLIENT', 'OPS', 'SALES', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company_id" varchar(256) NOT NULL,
	"role_type" "team_role_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_companies" (
	"id" varchar(191),
	"company_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_omnipresent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_to_companies_user_id_company_id_pk" PRIMARY KEY("user_id","company_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_teams" (
	"id" varchar(191),
	"team_id" varchar(256) NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_to_teams_user_id_team_id_pk" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_companies" ADD CONSTRAINT "users_to_companies_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_companies" ADD CONSTRAINT "users_to_companies_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_teams" ADD CONSTRAINT "users_to_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_teams" ADD CONSTRAINT "users_to_teams_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
