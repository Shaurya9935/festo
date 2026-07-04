CREATE TYPE "public"."event_status_enum" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizer_id" text,
	"event_name" varchar(50) NOT NULL,
	"event_description" text NOT NULL,
	"event_venue" varchar(50) NOT NULL,
	"event_status" "event_status_enum" DEFAULT 'draft' NOT NULL,
	"event_start_at" timestamp NOT NULL,
	"event_end_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addtional_info" RENAME COLUMN "participat_number" TO "participant_number";--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_user_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;