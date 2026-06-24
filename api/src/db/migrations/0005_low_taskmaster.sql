ALTER TABLE "services" ALTER COLUMN "duration_minutes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "parent_id" integer;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;