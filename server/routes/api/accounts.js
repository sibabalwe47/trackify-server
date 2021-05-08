const express = require("express");
const router = express.Router();
const AccountsController = require("../../controllers/AccountController");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../../middleware/validators");
const auth = require("../../middleware/authToken");

/*
     URL:           /api/accounts/register
     METHOD:        POST
     Description:   Allows user to register
 */

router.post(
  "/register",
  validateUserRegistration,
  AccountsController.registerUser
);

/*
     URL:           /api/accounts/login
     METHOD:        POST
     Description:   Allows user to login
 */

router.post("/login", validateUserLogin, AccountsController.loginUser);

/*
     URL:           /api/accounts/user
     METHOD:        GET
     Description:   Allows user to account information
 */

router.get("/user", auth, AccountsController.getUserAccount);

module.exports = router;
