/**
 * Test constants and environment configuration
 */
import dotenv from 'dotenv'

dotenv.config()

// User credentials from environment variables
export const CREDENTIALS = {
  userName: process.env.SAUCEDEMO_USERNAME!,
  password: process.env.SAUCEDEMO_PASSWORD!,
  lockedOutUserName:
    process.env.SAUCEDEMO_LOCKEDOUT_USERNAME || "locked_out_user",
};

// Test data
export const TEST_PRODUCTS = {
  BACKPACK: "Sauce Labs Backpack",
  BIKE_LIGHT: "Sauce Labs Bike Light",
  BOLT_TSHIRT: "Sauce Labs Bolt T-Shirt",
  FLEECE_JACKET: "Sauce Labs Fleece Jacket",
  ONESIE: "Sauce Labs Onesie",
  RED_TSHIRT: "Test.allTheThings() T-Shirt (Red)",
};

export const TEST_CUSTOMER = {
  firstName: "John",
  lastName: "Doe",
  postalCode: "12345",
};
