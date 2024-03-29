const customerService = require("../services/customer.service");
const { emailValidator, phoneValidator } = require( "../utils/util");

const getAllCustomers = async (req, res) => {
  console.log('this is reached');
  try {
    const allCustomers = await customerService.getAllCustomers();
    if (res && res.status) {
      
      res.status(200).json({ message: allCustomers });
      return;
    }
  } catch (error) {
    console.log(error);
    if (res && res.status) {
      res.status(500).json({ status: "ERROR", data: "Server error" });
    }
  }
};

const getOneCustomer = async (req, res) => {
  try {
    const { customerID = "" } = await req.params;
    if (res && res.status) {
      const oneCustomer = await customerService.getOneCustomer(customerID);
      res.status(200).json(oneCustomer);
    }
  } catch (err) {
    console.log(err);
    if (res && res.status) {
      res.status(500).send({ message: "Server error" });
    }
  }
};

const oneCustomerQuery = async (req, res) => {
  try {
    const {email = ''} = req.query;
    const customerDetails = await customerService.oneCustomerQuery(email)
    res.status(200).json(customerDetails)
  } catch (err) {
    console.log("error", err);
    return {message: "Wrong email/Password"};
  }
};

const verifyCustomer = async (req, res) => {
  try {
    const { password, email } = req.body;
    const checkCustomerId = await customerService.oneCustomerQuery(email);
    if (checkCustomerId.customer_id) {
      const {customer_id} = checkCustomerId;
      const verifiedCustomer = await customerService.verifyCustomer(
        password,
        customer_id
      );
      console.log(verifiedCustomer)
      if (verifiedCustomer) {
      res.status(200).json({ message: verifiedCustomer });
      } else {
        res.status(404).json({message: false})  
      } 
    } else {
      console.log('wrong email/password')
      res.status(404).json({message: false})
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "server error" });
  }
};
const addCustomer = async (req, res) => {
  
  const { first_name, last_name, email, phone_number, password } = req.body;
  console.log(req.body)
  
  
  try {
    if (!first_name || !last_name || !email || !phone_number || !password) {
      res.status(400).json({message: "all fields are required"})
    } else if (!emailValidator(email)) {
      res.status(400).json({message: "enter a correct email"})
    } else if (!phoneValidator(phone_number)) {
      res.status(400).json({message: "enter a 10-digit phone number"})
    }

    else {
    const customerDetails = [first_name, last_name, email, phone_number];
    const result = await customerService.addCustomer(password, customerDetails);
    res.status(200).json({ message: result });}
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred" });
  }
};
//updating customer
const updateCustomer = async (req, res) => {

  try {
    const { customerID } = req.params;
    const { first_name = '', last_name = '', email = '', phone_number = ''} = req.body;
    const customerDetails = [first_name, last_name, email, phone_number];
    const updateCustomer = await customerService.updateCustomer(
      customerID,
      customerDetails
    );
    res.status(200).json({ message: updateCustomer });
  } catch (err) {
    console.log("Could not update customer details", err);
    res.status(500).json({ message: "server error" });
  }
};
//deleting customer detail
const deleteCustomer = async (req, res) => {
  try {
    const { customerID } = req.params;
    const customerDelete = await customerService.deleteCustomer(customerID);
    console.log(customerDelete);
    res.status(200).json({ message: customerDelete });
  } catch (err) {
    console.log("could not delete customer");
    console.log(err)
    res.status(500).json({ message: "Server ERROR" });
  }
};
//exporting functions
module.exports = {
  getAllCustomers,
  getOneCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  oneCustomerQuery,
  verifyCustomer
};
