ALTER TABLE "users" RENAME COLUMN "full_name" TO "pseudo";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "phone" TO "email";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "pseudo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isMember" boolean;