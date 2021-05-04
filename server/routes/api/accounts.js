const express = require('express');
const router = express.Router();
const AccountsController = require('../../controllers/AccountController');
const { validateUserRegistration, validateUserLogin } = require('../../middleware/validators');

/*
     URL:           /api/accounts/register
     METHOD:        POST
     Description:   Allows user to register
 */

router.post("/register", validateUserRegistration , AccountsController.registerUser);


/*
     URL:           /api/accounts/login
     METHOD:        POST
     Description:   Allows user to login
 */

router.post("/login", validateUserLogin ,AccountsController.loginUser);



module.exports = router;