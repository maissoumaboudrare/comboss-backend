CREATE TABLE IF NOT EXISTS "characters" (
	"character_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(10) NOT NULL,
	"height" integer NOT NULL,
	"weight" integer NOT NULL,
	"story" text,
	"type" varchar(10),
	"effective_range" varchar(10),
	"ease_of_use" varchar(10),
	"avatar" varchar(200) NOT NULL,
	"number_of_combos" integer NOT NULL,
	"number_of_likes" integer NOT NULL,
	"number_of_lovers" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "combos" (
	"combo_id" serial PRIMARY KEY NOT NULL,
	"character_id" integer,
	"user_id" integer,
	"position" text NOT NULL,
	"likes" integer NOT NULL,
	"is_saved" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inputs" (
	"inputs_id" serial PRIMARY KEY NOT NULL,
	"combo_id" integer,
	"directions[]" text[] DEFAULT ARRAY[]::text[],
	"special_inputs[]" text[] DEFAULT ARRAY[]::text[],
	"punches[]" text[] DEFAULT ARRAY[]::text[],
	"kicks[]" text[] DEFAULT ARRAY[]::text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sessions_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"token" text NOT NULL,
	"expiration_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"pseudo" varchar(8),
	"email" varchar(20),
	"password" text NOT NULL,
	"is_member" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "combos" ADD CONSTRAINT "combos_character_id_characters_character_id_fk" FOREIGN KEY ("character_id") REFERENCES "characters"("character_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "combos" ADD CONSTRAINT "combos_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inputs" ADD CONSTRAINT "inputs_combo_id_combos_combo_id_fk" FOREIGN KEY ("combo_id") REFERENCES "combos"("combo_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
