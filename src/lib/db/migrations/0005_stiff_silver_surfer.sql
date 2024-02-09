CREATE TABLE IF NOT EXISTS "liaison_responses" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"originating_supplier_response_id" varchar(256) NOT NULL,
	"responds_to_client_request_id" varchar(256) NOT NULL,
	"from_liaison_user_id" varchar(256) NOT NULL,
	"margin" real,
	"unit_cost" real,
	"print_plate_cost" real,
	"die_cost" real,
	"other_setup_cost" real,
	"delivery_cost" real,
	"tax" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier_responses" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"responds_to_liaison_request_id" varchar(256) NOT NULL,
	"from_supplier_user_id" varchar(256) NOT NULL,
	"is_approved" boolean,
	"price" text,
	"unit_cost" real,
	"print_plate_cost" real,
	"die_cost" real,
	"other_setup_cost" real,
	"delivery_cost" real,
	"tax" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_responses" ADD CONSTRAINT "liaison_responses_originating_supplier_response_id_supplier_responses_id_fk" FOREIGN KEY ("originating_supplier_response_id") REFERENCES "supplier_responses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_responses" ADD CONSTRAINT "liaison_responses_responds_to_client_request_id_client_requests_id_fk" FOREIGN KEY ("responds_to_client_request_id") REFERENCES "client_requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_responses" ADD CONSTRAINT "liaison_responses_from_liaison_user_id_user_id_fk" FOREIGN KEY ("from_liaison_user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supplier_responses" ADD CONSTRAINT "supplier_responses_responds_to_liaison_request_id_liaison_requests_id_fk" FOREIGN KEY ("responds_to_liaison_request_id") REFERENCES "liaison_requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supplier_responses" ADD CONSTRAINT "supplier_responses_from_supplier_user_id_user_id_fk" FOREIGN KEY ("from_supplier_user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
