ALTER TABLE "liaison_responses" ALTER COLUMN "margin" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "unit_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "print_plate_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "die_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "other_setup_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "delivery_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "liaison_responses" ALTER COLUMN "tax" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "unit_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "print_plate_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "die_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "other_setup_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "delivery_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "supplier_responses" ALTER COLUMN "tax" SET DATA TYPE numeric;