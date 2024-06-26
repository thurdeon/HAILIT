import { v4 as uuid } from "uuid";
import { addOne, checkOneDetail, deleteOne, getAll, getOne, getSpecificDetails, getSpecificDetailsUsingId, updateOne} from "./dBFunctions.js"

const riderTableName = "rider";
const riderColumnsForAdding = ["rider_id", "vehicle_id", "user_id"];

const defaultVehicleId = "04daa784-1dab-4b04-842c-a9a3ff8ae016";

export const getAllRiders = async () => {
  try {

    const allRiders = await getAll(riderTableName);
    if (allRiders.error) {
      return {error: allRiders.error}
    }
    return allRiders;
  } catch (err) {
    return ({error: "Server error occurred getting all uses"})
  }
  ;}

  export const getOneRiderFromDB = async (rider_id) => {
  try {
    const riderIdColumn = riderColumnsForAdding[0];
    const rider = await getOne(
      riderTableName,
      riderIdColumn,
      rider_id
    );
    if(rider.error) {
      return { error: "Rider not found" };
    }
    
      return rider[0];
    
    
    
  } catch (err) {
    return { error: `Error occurred. Rider not fetched: ${err}` };
  }
};

export const getRiderOnConditionFromDB = async (columnName, condition) => {
  try {
    const riderDetails = await checkOneDetail(
      riderTableName,
      columnName,
      condition
    );
    return riderDetails;
  } catch (err) {
    return {error:"No Driver Details Found"};
  }
};

export const getSpecificRidersFromDB = async (specificColumn, condition) => {
  try {
    const specificRiders = await getSpecificDetails(
      riderTableName,
      specificColumn,
      condition
    );
    return specificRiders;
  } catch (err) {
    return {error:`Error occurred in retrieving drivers: ${err}`};
  }
};

export const addRiderToDB = async (user_id) => {
  try {

    const userIsRider = await getSpecificDetailsUsingId(riderTableName, user_id, 'user_id', 'rider_id');
    if(userIsRider.length >= 1) {
      return {error: "User is rider"}
    }
    const rider_id = uuid();
    const riderDetails = [rider_id, defaultVehicleId, user_id];
    const addingMotor = await addOne(
      riderTableName,
      riderColumnsForAdding,
      riderDetails
    );
    if (addingMotor) {
      return addingMotor;
    }
  } catch (err) {
    return {error: "Error occurred adding rider"}
  }
};

export const updateRiderOnDB = async (riderDetails) => {
  const { rider_id } = riderDetails;
  const idColumn = riderColumnsForAdding[0];
  const tableColumns = Object.keys(riderDetails);
  const riderDetailsArray = Object.values(riderDetails);

  

  try {
    const riderUpdate = await updateOne(
      riderTableName,
      tableColumns,
      rider_id,
      idColumn,
      ...riderDetailsArray
    );
    
    if (riderUpdate.rowCount ===0) {
      return { error: "Rider details not updated" };
    }
    return riderUpdate.rows[0];
  } catch (err) {
    return { error: `Error occurred in updating rider details ${err}` };
  }
};

export const deleteRiderFromDB = async (rider_id) => {
  try {
    const riderDelete = await deleteOne(
      riderTableName,
      riderColumnsForAdding[0],
      rider_id
    );
    if (riderDelete) {
      return riderDelete;
    } else {
      return { error: "rider not deleted" };
    }
  } catch (err) {
    return {error:"Error Occurred Deleting Rider"};
  }
};

