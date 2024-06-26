
import {addTripToDB, deleteTripFromDB, getAllTripsFromDB, getOneTripFromDB, getUserTripsFromDB, ratingCouIntIncrease, updateTripOnDB } from '../model/trip.model.js';
import crypto from 'crypto'
import { getOneRiderService } from "./rider.service.js";
import { getOneUserFromDB } from "../model/user.model.js";
import {  getDriverDetailOnCondition, getSpecificDriversFromDB, updateDriverOnDB} from "../model/driver.model.js";
import { getOneDriverService } from "./driver.service.js";
import { getRiderOnConditionFromDB, getSpecificRidersFromDB, updateRiderOnDB } from "../model/rider.model.js";
import { allowedPropertiesOnly } from '../utils/util.js';

import {config} from 'dotenv';

config({ path: '../../../.env' });

export const tripFieldsToSelect = [
  "dispatcher_id, trip_medium, trip_status, package_type, pickup_location, drop_off_location, additional_information, trip_request_date, trip_cost, payment_status, payment_method "
];
// const allowedTripStatus = ['new', 'in progress', 'completed', 'cancelled'];
export const allowedAddTripProperties = [
  "trip_medium",
  "package_type",
  "pickup_location",
  "drop_off_location",
  "additional_information",
];

export const getAllTripsService = async () => {
  try {
    const allTrips = await getAllTripsFromDB();
    if(allTrips.error) {
      return {error: "No trips found"}
    }
    return allTrips;
  } catch (err) {
    
    return {error:"Error Occurred  in getting Trips Detail"};
  }
};

export const getOneTripService = async (trip_id) => {
  
  try {
    const tripIdColumn = "trip_id";
    const oneTrip = await getOneTripFromDB(trip_id, tripIdColumn);
    console.log('OneTrip:', oneTrip)
    if(oneTrip.error) {
      return {error: oneTrip.error}
    }
    const {dispatcher_id, trip_medium} = oneTrip;
    let dispatcherDetails = {}
      trip_medium == 'motor' ? dispatcherDetails = await getOneRiderService(dispatcher_id) : dispatcherDetails = await getOneDriverService(dispatcher_id);
      if (dispatcherDetails.error) {
        console.log('dispatcherDetails.error:', dispatcherDetails.error)
        return {...oneTrip, dispatcher: 'Not assigned'}
      }
    
    return {...oneTrip, dispatcher: dispatcherDetails};
  } catch (err) {
    return {error:"Error Occurred in getting Trip Detail"};
  }
};

export const getUserTripsService = async (user_id) => {
  
  try {
    const userData = await getOneUserFromDB(user_id);
    
    if (userData.error) {
      return {error: userData.error};
    }
    const { user_role } = userData;
    
    if (user_role === "customer") {
      const allCustomerTrips = await getCustomerTrips (user_id);
      if(customerTrips.error) {
        return {error: customerTrips.error}
      }
      return allCustomerTrips;
      
    }
    
    if (user_role === "driver" || user_role === "rider") {
      const allDispatcherTrips = await dispatcherTrips (user_role);
      if (allDispatcherTrips.error) {
        return {error: allDispatcherTrips.error}
      }
      return allDispatcherTrips;
      
    }
  } catch (err) {
    console.log(err)
    return {error: "Error occurred getting user trips details"};
  }
};
 //CUSTOMER TRIPS (HELPER FUNCTION)
 export const getCustomerTrips = async (user_id) => {
  const idColumn = "customer_id";
  try {

    const trips = await getUserTripsFromDB(
      user_id,
      idColumn,
      tripFieldsToSelect
    );
    
    if(trips.error) {
      return {error: trips.error}
    }
    return trips;
  } catch (err) {
    return {error: `Error occurred getting customer trips: ${err}`}
  }
 }
 //DISPATCHER TRIPS (HELPER FUNCTION)
 export const dispatcherTrips = async (user_role)=> {
  try {
    const tripFieldsToSelect = [
      "trip_id, trip_medium, trip_status, trip_type, drop_off_location, package_type, trip_commencement_date, trip_completion_date",
    ];
    
    //dispatcher is used to represent drivers and riders except user role
    
    let dispatcherData = {};
    let dispatcher_id = '';
    if (user_role === 'rider'){
    dispatcherData = await getRiderOnConditionFromDB("user_id", user_id );
    if(dispatcherData.error) {
      return {error: dispatcherData.error}
    }
    const returnedDispatcherData = dispatcherData.rows[0];
    dispatcher_id = returnedDispatcherData.rider_id;
    }
    
    if (user_role === "driver") {
      dispatcherData = await getDriverDetailOnCondition(
        "user_id",
        user_id
      );

      if(dispatcherData.error) {
        return {error: dispatcherData.error}
      }
      
      dispatcher_id = dispatcherData[0].driver_id;
    }
    

    const idColumn = "dispatcher_id"; //this is because dispatcher is used to represent rider and driver in the trips table
    const dispatcherTrips = await getUserTripsFromDB(
      dispatcher_id,
      idColumn,
      tripFieldsToSelect
    );
    if(dispatcherTrips.error) {
      return {error: dispatcherTrips.error}
    }
    return dispatcherTrips;
  } catch (err) {
    return {error: `Error occurred getting dispatcher trips: ${err}`}
  }
}
export const addTripService = async (user_id, tripDetails) => {
  try {
    const trip_id = crypto.randomBytes(4).toString("hex");
    const validTripDetails = allowedPropertiesOnly(tripDetails, allowedAddTripProperties);
    

    const trip_cost = 89 - 45; // current destination - delivery destination
    const dispatcher_id = await getDispatcherId(tripDetails.trip_medium);

    const tripStatusDetails = {
      trip_status: "new",
      trip_request_date: "now()",
      dispatcher_id,
      trip_cost: trip_cost,
      payment_status: false,
      payment_method: "payment on delivery",
    };

    const finalTripDetails = {
      trip_id,
      customer_id: user_id,
      ...validTripDetails,
      ...tripStatusDetails,
    };

    const newTrip = await addTripToDB(finalTripDetails);
    if (newTrip.error) {
      return { error: newTrip.error };
    }

    return newTrip;
  } catch (err) {
    return { error: "Server Error Occurred Adding User Trip" };
  }
};

export const getDispatcherId = async (trip_medium) => {
  let dispatcher_id = 'ff-12-53';

  if (trip_medium === "car" || trip_medium === "truck") {
    const availableDrivers = await getSpecificDriversFromDB("driver_availability", "available");
    if (availableDrivers && availableDrivers.length > 0) {
      dispatcher_id = availableDrivers[0].driver_id;
    }
  }

  if (trip_medium === "motor") {
    const availableRiders = await getSpecificRidersFromDB("rider_availability", "available");
    if (availableRiders && availableRiders.length > 0) {
      dispatcher_id = availableRiders[0].rider_id;
    }
  }

  return dispatcher_id;
};

export const updateTripService = async (tripDetails) => {
  const allowedProperties = [
    "trip_id",
    "trip_medium",
    "trip_status",
    "trip_type",
    "package_type",
    "package_value",
    "pickup_location",
    "drop_off_location",
    "additional_information",
    "trip_commencement_date",
    "trip_completion_date",
    "payment_status",
    "payment_method",
    "dispatcher_id",
    "recipient_number",
    "sender_number"
    
  ];

  try {
    const validTripDetails = allowedPropertiesOnly(
      tripDetails,
      allowedProperties
    );

    const tripUpdate = await updateTripOnDB(validTripDetails);
    if(tripUpdate.error) {
      return {error: tripUpdate.error}
    }
      return tripUpdate;
    
  } catch (err) {
    return {error:"Server Error Occurred Updating Trip"};
  }
};

export const rateTripService = async (ratingDetails) => {
  try {
    const ratingDetailsWithRatingStatus = { ...ratingDetails, rated: true };
    const allowedProperties = ["dispatcher_rating", "trip_id", "dispatcher_id", "rated"];
    const validTripDetails = allowedPropertiesOnly(ratingDetailsWithRatingStatus, allowedProperties);

    const { trip_id, dispatcher_id } = validTripDetails;
    const updateTrip = await updateTripOnDB(validTripDetails);
    if (updateTrip.error) {
      return { error: updateTrip.error };
    }

    const tripMedium = await tripModel.getSpecificDetailsUsingId(trip_id, "trip_id", "trip_medium");
    const cumulativeDispatcherRating = await tripModel.getSpecificDetailsUsingId(dispatcher_id, "dispatcher_id", "AVG(dispatcher_rating)");
    const averageDispatcherRating = cumulativeDispatcherRating[0].avg;
    const { trip_medium } = tripMedium[0];

    const ratingUpdate = await updateDispatcherRating(trip_medium, dispatcher_id, averageDispatcherRating);
    if (ratingUpdate.error) {
      return { error: ratingUpdate.error };
    }

    const ratingCountUpdate = await increaseRatingCount(trip_medium, dispatcher_id);
    if (ratingCountUpdate.error) {
      return { error: ratingCountUpdate.error };
    }

    return { success: "trip updated with rating" };
  } catch (err) {
    return { error: "Server Error Occurred Adding Rating" };
  }
};

//UPDATE DISPATCHER RATING (HELPER FUNCTION)
export const updateDispatcherRating = async (trip_medium, dispatcher_id, averageDispatcherRating) => {
  if (trip_medium === "motor") {
    const riderUpdate = await updateRiderOnDB({ cumulative_rider_rating: averageDispatcherRating, rider_id: dispatcher_id });
    if (riderUpdate.error) {
      return { error: riderUpdate.error };
    }
  } else if (trip_medium === "car" || trip_medium === "truck") {
    const driverUpdate = await updateDriverOnDB({ cumulative_driver_rating: averageDispatcherRating, driver_id: dispatcher_id });
    if (driverUpdate.error) {
      return { error: driverUpdate.error };
    }
  }
  return { success: true };
};

//INCREASE RATING COUNT (HELPER FUNCTION)
export const increaseRatingCount = async (trip_medium, dispatcher_id) => {
  let tableName, idColumn, ratingCountColumn;
  if (trip_medium === "motor") {
    tableName = 'rider';
    idColumn = 'rider_id';
    ratingCountColumn = 'rider_rating_count';
  } else if (trip_medium === "car" || trip_medium === "truck") {
    tableName = 'driver';
    idColumn = 'driver_id';
    ratingCountColumn = 'driver_rating_count';
  } else {
    return { error: "Invalid trip medium" };
  }

  const countIncrease = await ratingCouIntIncrease(tableName, dispatcher_id, idColumn, ratingCountColumn);
  if (countIncrease.error) {
    return { error: countIncrease.error };
  }
  return { success: true };
};

export const deleteTripService = async (trip_id) => {
  try {
    const tripDelete = await deleteTripFromDB(trip_id);
    if (tripDelete) {
      return tripDelete;
    } else {
      return { error: "trip not deleted" };
    }
  } catch (err) {
    return { error: "Error occurred deleting trip" };
  }
};
