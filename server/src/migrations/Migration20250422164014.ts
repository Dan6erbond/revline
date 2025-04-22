import { Migration } from '@mikro-orm/migrations';

export class Migration20250422164014 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "profile" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "username" varchar(255) null, "first_name" varchar(255) null, "last_name" varchar(255) null, "currency_code" varchar(255) null, "fuel_volume_unit" text check ("fuel_volume_unit" in ('Liter', 'Gallon', 'ImperialGallon')) null, "distance_unit" text check ("distance_unit" in ('Kilometers', 'Miles')) null, "fuel_consumption_unit" text check ("fuel_consumption_unit" in ('MPG', 'MPG_Imperial', 'KPL', 'LP100K')) null, "temperature_unit" text check ("temperature_unit" in ('Celsius', 'Fahrenheit')) null, "profile_picture" uuid null, "visibility" text check ("visibility" in ('Public', 'Private')) not null default 'Private', constraint "profile_pkey" primary key ("id"));`);
    this.addSql(`alter table "profile" add constraint "profile_user_id_unique" unique ("user_id");`);
    this.addSql(`alter table "profile" add constraint "profile_username_unique" unique ("username");`);

    this.addSql(`create table "car" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "owner_id" uuid not null, "name" varchar(255) not null, "make" varchar(255) not null, "model" varchar(255) not null, "year" int not null, "banner_image_id" uuid null, constraint "car_pkey" primary key ("id"));`);
    this.addSql(`alter table "car" add constraint "car_banner_image_id_unique" unique ("banner_image_id");`);

    this.addSql(`create table "service_schedule" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, "title" varchar(255) not null, "notes" varchar(255) null, "repeat_every_km" int null, "repeat_every_months" int null, "starts_at_km" int null, "starts_at_date" timestamptz null, "archived" boolean not null default false, constraint "service_schedule_pkey" primary key ("id"));`);

    this.addSql(`create table "service_item" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, "label" varchar(255) not null, "notes" varchar(255) null, "estimated_duration" int null, "default_interval_km" int null, "default_interval_months" int null, "tags" text[] not null default '{}', constraint "service_item_pkey" primary key ("id"));`);

    this.addSql(`create table "service_schedule_items" ("service_schedule_id" uuid not null, "service_item_id" uuid not null, constraint "service_schedule_items_pkey" primary key ("service_schedule_id", "service_item_id"));`);

    this.addSql(`create table "odometer_reading" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, "reading_km" real not null, "location_lat" int null, "location_lng" int null, "notes" varchar(255) null, constraint "odometer_reading_pkey" primary key ("id"));`);

    this.addSql(`create table "service_log" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, "date_performed" timestamptz not null, "odometer_reading_id" uuid null, "notes" varchar(255) null, "schedule_id" uuid null, "performed_by" varchar(255) null, constraint "service_log_pkey" primary key ("id"));`);
    this.addSql(`alter table "service_log" add constraint "service_log_odometer_reading_id_unique" unique ("odometer_reading_id");`);

    this.addSql(`create table "service_log_service_items" ("service_log_id" uuid not null, "service_item_id" uuid not null, constraint "service_log_service_items_pkey" primary key ("service_log_id", "service_item_id"));`);

    this.addSql(`create table "media" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, constraint "media_pkey" primary key ("id"));`);

    this.addSql(`create table "fuel_up" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, "occurred_at" timestamptz not null, "station" varchar(255) not null, "amount_liters" real not null, "cost" real not null, "fuel_category" text check ("fuel_category" in ('PETROL', 'DIESEL', 'ELECTRIC', 'LPG', 'OTHER')) not null, "octane" text check ("octane" in ('RON91', 'RON95', 'RON98', 'RON100', 'E85', 'RACE')) not null, "odometer_reading_id" uuid null, "notes" varchar(255) null, "is_full_tank" boolean not null default false, "location_lat" int null, "location_lng" int null, constraint "fuel_up_pkey" primary key ("id"));`);
    this.addSql(`alter table "fuel_up" add constraint "fuel_up_odometer_reading_id_unique" unique ("odometer_reading_id");`);

    this.addSql(`create table "drag_session" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "car_id" uuid not null, "title" varchar(255) not null, "notes" varchar(255) null, constraint "drag_session_pkey" primary key ("id"));`);

    this.addSql(`create table "drag_result" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "session_id" uuid not null, "unit" text check ("unit" in ('Kph', 'Km')) not null, "value" real not null, "result" real not null, "notes" varchar(255) null, constraint "drag_result_pkey" primary key ("id"));`);

    this.addSql(`alter table "profile" add constraint "profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "car" add constraint "car_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "car" add constraint "car_banner_image_id_foreign" foreign key ("banner_image_id") references "media" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service_schedule" add constraint "service_schedule_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);

    this.addSql(`alter table "service_item" add constraint "service_item_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);

    this.addSql(`alter table "service_schedule_items" add constraint "service_schedule_items_service_schedule_id_foreign" foreign key ("service_schedule_id") references "service_schedule" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "service_schedule_items" add constraint "service_schedule_items_service_item_id_foreign" foreign key ("service_item_id") references "service_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "odometer_reading" add constraint "odometer_reading_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);

    this.addSql(`alter table "service_log" add constraint "service_log_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);
    this.addSql(`alter table "service_log" add constraint "service_log_odometer_reading_id_foreign" foreign key ("odometer_reading_id") references "odometer_reading" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "service_log" add constraint "service_log_schedule_id_foreign" foreign key ("schedule_id") references "service_schedule" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service_log_service_items" add constraint "service_log_service_items_service_log_id_foreign" foreign key ("service_log_id") references "service_log" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "service_log_service_items" add constraint "service_log_service_items_service_item_id_foreign" foreign key ("service_item_id") references "service_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "media" add constraint "media_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);

    this.addSql(`alter table "fuel_up" add constraint "fuel_up_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);
    this.addSql(`alter table "fuel_up" add constraint "fuel_up_odometer_reading_id_foreign" foreign key ("odometer_reading_id") references "odometer_reading" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "drag_session" add constraint "drag_session_car_id_foreign" foreign key ("car_id") references "car" ("id") on update cascade;`);

    this.addSql(`alter table "drag_result" add constraint "drag_result_session_id_foreign" foreign key ("session_id") references "drag_session" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "profile" drop constraint "profile_user_id_foreign";`);

    this.addSql(`alter table "car" drop constraint "car_owner_id_foreign";`);

    this.addSql(`alter table "service_schedule" drop constraint "service_schedule_car_id_foreign";`);

    this.addSql(`alter table "service_item" drop constraint "service_item_car_id_foreign";`);

    this.addSql(`alter table "odometer_reading" drop constraint "odometer_reading_car_id_foreign";`);

    this.addSql(`alter table "service_log" drop constraint "service_log_car_id_foreign";`);

    this.addSql(`alter table "media" drop constraint "media_car_id_foreign";`);

    this.addSql(`alter table "fuel_up" drop constraint "fuel_up_car_id_foreign";`);

    this.addSql(`alter table "drag_session" drop constraint "drag_session_car_id_foreign";`);

    this.addSql(`alter table "service_schedule_items" drop constraint "service_schedule_items_service_schedule_id_foreign";`);

    this.addSql(`alter table "service_log" drop constraint "service_log_schedule_id_foreign";`);

    this.addSql(`alter table "service_schedule_items" drop constraint "service_schedule_items_service_item_id_foreign";`);

    this.addSql(`alter table "service_log_service_items" drop constraint "service_log_service_items_service_item_id_foreign";`);

    this.addSql(`alter table "service_log" drop constraint "service_log_odometer_reading_id_foreign";`);

    this.addSql(`alter table "fuel_up" drop constraint "fuel_up_odometer_reading_id_foreign";`);

    this.addSql(`alter table "service_log_service_items" drop constraint "service_log_service_items_service_log_id_foreign";`);

    this.addSql(`alter table "car" drop constraint "car_banner_image_id_foreign";`);

    this.addSql(`alter table "drag_result" drop constraint "drag_result_session_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "profile" cascade;`);

    this.addSql(`drop table if exists "car" cascade;`);

    this.addSql(`drop table if exists "service_schedule" cascade;`);

    this.addSql(`drop table if exists "service_item" cascade;`);

    this.addSql(`drop table if exists "service_schedule_items" cascade;`);

    this.addSql(`drop table if exists "odometer_reading" cascade;`);

    this.addSql(`drop table if exists "service_log" cascade;`);

    this.addSql(`drop table if exists "service_log_service_items" cascade;`);

    this.addSql(`drop table if exists "media" cascade;`);

    this.addSql(`drop table if exists "fuel_up" cascade;`);

    this.addSql(`drop table if exists "drag_session" cascade;`);

    this.addSql(`drop table if exists "drag_result" cascade;`);
  }

}
