const connection = require('../config/db');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');

exports.registerUser = asyncHandler(async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);

    // Return error containing missing information from fields
    if(!errors.isEmpty()) return res.status(400).json({
        success: false,
        errors: errors.array()
    });

    // Get register information
    const data = {};
    data.firstName = req.body.firstName;
    data.lastName = req.body.lastName;
    data.emailAddress = req.body.emailAddress;

    data.avatar = req.body.avatar;

    

    // Check if user exists
    let query = connection().query(`SELECT * FROM accounts WHERE emailAddress = '${req.body.emailAddress}'`, async (err, result) => {
        if(err) throw err;


        // Check user with matching email in the database & return error
        if(result.length > 0) return res.status(400).send({
            success: false,
            message: 'Email already exists'
        });

        // Generate salt
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);
        data.password = hashedPwd;

        // Insert new user into database 
        connection().query("INSERT INTO accounts SET ?", data, (err, result) => {
            if(err) throw err;

            // Get last insert record id and create a token
            const token = jwt.sign({_id: result.insertId}, 'secrettoken')

            // Return user data with token to client
            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.emailAddress
                },
                token
            })

        })
        
    });
})

exports.loginUser = asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    // Return error containing missing information from fields
   if(!errors.isEmpty()) return res.status(400).json({
       success: false,
       errors: errors.array()
   });

   // Check if user exists
   let query = connection().query(`SELECT * FROM accounts WHERE emailAddress = '${req.body.emailAddress}'`, async (err, result) => {
       if(err) throw err;
       
       // User does not exist case
       if(result.length === 0) return res.status(400).json({
           success: false,
           message: 'Account not exist'
       });

       const userPassword = result[0].password;
       const passwordMatches = await bcrypt.compare(req.body.password, userPassword);

       if(!passwordMatches) return res.status(401).json({
           success: false,
           message: "Incorrect email or password"
       })

       // Create and asign a token
       const token = jwt.sign({_id: result[0].id}, 'secrettoken');

       res.json({
           success: true,
           message: 'Logged in successfully',
           user: {
               id:  result[0].id,
               firstName:  result[0].firstName,
               lastName:  result[0].lastName,
               emailAddress:  result[0].emailAddress,
               avatar:  result[0].avatar
           },
           token
       })
    //    bcrypt.compare(req.body.password, userPassword, (err, result) => {
    //        if(err) console.log(err);
    //        console.log(result)
    //    })



      
   });
})