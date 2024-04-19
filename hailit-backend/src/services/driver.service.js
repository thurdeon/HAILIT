const driverModel = require('../model/driver.model');
const { allowedPropertiesOnly } = require( "../utils/util");

const getAllDrivers = async ()=> {
    const drivers = await driverModel.getAllDrivers();
    return drivers;
}


const getOneDriver = async (driver_id)=> {
    try {
    const data = await driverModel.getOneDriver(driver_id);
    if(data) {
        return data;
    } else {
        return {message: "user not found"}
    }
    } catch (err) {
        return {message: `Error occurred getting driver: ${err}`}
    }
}

const addDriver = async (user_id, vehicle_id)=>  {
    const driverAdd = await driverModel.addDriver(user_id, vehicle_id);
    if(driverAdd) {
        return driverAdd
    } else {
        return {message: "driver not added"}
    }
}

const updateDriver = async(driverDetails)=> {
    const allowedProperties = ['driver_id', 'vehicle_id', 'driver_license_back', 'driver_license_front', 'driver_availability'];
    try {
    const validDriverDetails = await allowedPropertiesOnly(driverDetails, allowedProperties);
    const driverUpdate = await driverModel.updateDriver(validDriverDetails);
    if(driverUpdate) {
        
        return driverUpdate
    } else {
        console.log(driverUpdate.message)
        return {message: "driver details not updated"};
    }
    } catch (err) {
        return {message: `Error occurred updating driver details: ${err}`}
    }
}

const deleteDriver = async (driver_id) => {
    const driverDelete = await driverModel.deleteDriver(driver_id);
    if (driverDelete) {
        return driverDelete;
    } else {
        return {message: "driver not deleted"}
    }
    
}
module.exports={getAllDrivers, getOneDriver, addDriver, updateDriver, deleteDriver}