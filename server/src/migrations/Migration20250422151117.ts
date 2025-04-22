import { Migration } from '@mikro-orm/migrations';

export class Migration20250422151117 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "subscription" drop constraint "subscription_checkout_session_id_foreign";`);

    this.addSql(`drop table if exists "checkout_session" cascade;`);

    this.addSql(`drop table if exists "subscription" cascade;`);

    this.addSql(`alter table "user" drop column "stripe_customer_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "checkout_session" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "user_id" uuid not null, "plan" text check ("plan" in ('Diy', 'Enthusiast')) not null, "stripe_session_id" varchar(255) not null, constraint "checkout_session_pkey" primary key ("id"));`);

    this.addSql(`create table "subscription" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "user_id" uuid not null, "plan" text check ("plan" in ('Diy', 'Enthusiast')) not null, "stripe_subscription_id" varchar(255) null, "start_date" timestamptz(6) null, "end_date" timestamptz(6) null, "is_active" bool not null default false, "stripe_invoice_id" varchar(255) null, "checkout_session_id" uuid null, constraint "subscription_pkey" primary key ("id"));`);
    this.addSql(`alter table "subscription" add constraint "subscription_checkout_session_id_unique" unique ("checkout_session_id");`);

    this.addSql(`alter table "checkout_session" add constraint "checkout_session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "subscription" add constraint "subscription_checkout_session_id_foreign" foreign key ("checkout_session_id") references "checkout_session" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "subscription" add constraint "subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "user" add column "stripe_customer_id" varchar(255) null;`);
  }

}
