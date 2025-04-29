-- Create "documents" table
CREATE TABLE "documents" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "name" character varying NOT NULL,
  "tags" jsonb NOT NULL,
  "car_documents" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "documents_cars_documents" FOREIGN KEY ("car_documents") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL
);
