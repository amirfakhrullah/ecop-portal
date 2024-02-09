ALTER TABLE "client_requests" DROP CONSTRAINT "client_requests_from_client_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "liaison_requests" DROP CONSTRAINT "liaison_requests_from_liaison_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "liaison_responses" DROP CONSTRAINT "liaison_responses_originating_supplier_response_id_supplier_responses_id_fk";
--> statement-breakpoint
ALTER TABLE "supplier_responses" DROP CONSTRAINT "supplier_responses_responds_to_liaison_request_id_liaison_requests_id_fk";
--> statement-breakpoint
ALTER TABLE "client_requests" ALTER COLUMN "from_client_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "from_liaison_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "origininating_client_request_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "forwarded_to_supplier_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "originating_supplier_response_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "responds_to_client_request_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "from_liaison_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "responds_to_liaison_request_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "from_supplier_user_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_from_client_user_id_user_id_fk" FOREIGN KEY ("from_client_user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "liaison_responses" ADD CONSTRAINT "liaison_responses_originating_supplier_response_id_supplier_responses_id_fk" FOREIGN KEY ("originating_supplier_response_id") REFERENCES "supplier_responses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supplier_responses" ADD CONSTRAINT "supplier_responses_responds_to_liaison_request_id_liaison_requests_id_fk" FOREIGN KEY ("responds_to_liaison_request_id") REFERENCES "liaison_requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
