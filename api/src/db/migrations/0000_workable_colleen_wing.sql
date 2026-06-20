CREATE TABLE "professionals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"cpf" char(11) NOT NULL,
	"phone" varchar(11) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'PARTNER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"work_hours_start" varchar(5) DEFAULT '08:00' NOT NULL,
	"work_hours_end" varchar(5) DEFAULT '20:00' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "professionals_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "professionals_phone_unique" UNIQUE("phone")
);
