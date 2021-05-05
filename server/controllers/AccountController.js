const connection = require("../config/db");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sha256 = require("sha256");

// Bring in db controller
const DatabaseController = require("./DatabaseController");
// Instantiate db class
const Accounts = new DatabaseController("accounts");

exports.registerUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // Return error containing missing information from fields
  if (!errors.isEmpty())
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });

  // Check if any accounts match email used for signing up
  const account = await Accounts.findOne({
    emailAddress: req.body.emailAddress,
  });

  // Check user with matching email in the database & return error
  if (account.length > 0)
    return res.status(400).send({
      success: false,
      message: "Email already exists",
    });

  // Generate salt
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);

  // Create new user account
  const newAccount = await Accounts.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: hashedPwd,
    avatar: req.body.avatar,
  });

  // Created account successully
  if (newAccount.affectedRows == 1) {
    // Get last insert record id and create a token
    const token = jwt.sign({ _id: newAccount.insertId }, "secrettoken");

    // Return user data with token to client
    res.status(201).json({
      success: true,
      data: {
        id: newAccount.insertId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailAddress,
      },
      token,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Error creating new account",
    });
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // Return error containing missing information from fields
  if (!errors.isEmpty())
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });

  // Check if user exists
  const account = await Accounts.findOne({
    emailAddress: req.body.emailAddress,
  });

  // User does not exist case
  if (account.length === 0)
    return res.status(400).json({
      success: false,
      message: "Account not exist",
    });

  // Test to see if passwords match
  const userPassword = account[0].password;
  const passwordMatches = await bcrypt.compare(req.body.password, userPassword);

  if (!passwordMatches)
    return res.status(401).json({
      success: false,
      message: "Incorrect email or password",
    });

  // Create and asign a token
  const token = jwt.sign({ _id: account[0].id }, "secrettoken");

  res.json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: account[0].id,
      firstName: account[0].firstName,
      lastName: account[0].lastName,
      emailAddress: account[0].emailAddress,
      avatar: account[0].avatar,
    },
    token,
  });
});
