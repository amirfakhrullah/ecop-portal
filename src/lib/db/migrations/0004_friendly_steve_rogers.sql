ALTER TABLE "liaison_requests" DROP CONSTRAINT "liaison_requests_from_liaison_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "from_liaison_user_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "origininating_client_request_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "origininating_client_request_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "forwarded_to_supplier_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "liaison_requests" ALTER COLUMN "forwarded_to_supplier_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liaison_requests" ADD CONSTRAINT "liaison_requests_from_liaison_user_id_user_id_fk" FOREIGN KEY ("from_liaison_user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
