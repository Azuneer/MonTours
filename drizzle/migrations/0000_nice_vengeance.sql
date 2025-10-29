CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"siret" varchar(14),
	"siren" varchar(9),
	"naf" varchar(10),
	"company_type" varchar(50),
	"sector" varchar(100),
	"address" text,
	"postal_code" varchar(5),
	"city" varchar(100),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"website" varchar(255),
	"email" varchar(255),
	"phone" varchar(20),
	"description" text,
	"employees" varchar(50),
	"founded_year" varchar(4),
	"technologies" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_siret_unique" UNIQUE("siret")
);
--> statement-breakpoint
CREATE INDEX "siret_idx" ON "companies" USING btree ("siret");--> statement-breakpoint
CREATE INDEX "city_idx" ON "companies" USING btree ("city");--> statement-breakpoint
CREATE INDEX "company_type_idx" ON "companies" USING btree ("company_type");--> statement-breakpoint
CREATE INDEX "sector_idx" ON "companies" USING btree ("sector");--> statement-breakpoint
CREATE INDEX "postal_code_idx" ON "companies" USING btree ("postal_code");