BEGIN;

-- CREATE TABLE "trips" ----------------------------------------
CREATE TABLE "public"."trips" ( 
	"payment_status" Boolean DEFAULT 'false' NOT NULL,
	"trip_request_date" Timestamp With Time Zone NOT NULL,
	"trip_commencement_date" Timestamp With Time Zone,
	"trip_completion_date" Timestamp With Time Zone,
	"driver_rating" Numeric( 2, 1 ),
	"trip_cost" Numeric( 10, 2 ) NOT NULL,
	"delivery_address" Character Varying( 255 ) NOT NULL,
	"special_instructions" Character Varying( 255 ) DEFAULT 'no instructions'::character varying NOT NULL,
	"payment_method" Character Varying( 100 ) NOT NULL,
	"promo_code" Character Varying( 255 ) DEFAULT 'no promo code'::character varying NOT NULL,
	"driver_id" Character Varying( 255 ) NOT NULL,
	"trip_id" Character Varying( 255 ) NOT NULL,
	"driver_rating_comment" Character Varying( 255 ) DEFAULT 'no comment'::character varying NOT NULL,
	"user_id" Character Varying( 255 ) NOT NULL,
	"trip_type" Character Varying( 255 ) NOT NULL,
	"trip_status" Character Varying( 100 ) DEFAULT 'requested'::character varying NOT NULL,
	"delivery_item" Character Varying( 255 ) NOT NULL,
	"pickup_location" Character Varying( 255 ) NOT NULL,
	PRIMARY KEY ( "trip_id", "user_id" ) );
 ;
-- -------------------------------------------------------------

COMMIT;

BEGIN;

-- CREATE LINK "trips_user_id_fkey" ----------------------------
ALTER TABLE "public"."trips"
	ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ( "user_id" )
	REFERENCES "public"."users" ( "user_id" ) MATCH SIMPLE
	ON DELETE No Action
	ON UPDATE No Action;
-- -------------------------------------------------------------

COMMIT;
