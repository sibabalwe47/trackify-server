const { check } = require('express-validator');


exports.validateUserRegistration = [
    check('firstName').notEmpty().withMessage("First name is required"),
    check('lastName').notEmpty().withMessage("Last name is required"),
    check('emailAddress').notEmpty().withMessage('Please provide a valid email.'),
    check('password').isLength({min: 6}).withMessage('Password must atleast characters')
]

exports.validateUserLogin = [
    check('emailAddress').isEmail().withMessage('Please provide a valid email.'),
    check('password').isLength({min: 6}).withMessage('Password field cannot be empty')
]

exports.validateUserCategory = [
    check('name').notEmpty().withMessage('Category name is required.'),
    check('icon').notEmpty().withMessage("Category icon name is required.")
]

exports.validateUserHabit = [
    check('name').notEmpty().withMessage('Category name is required.'),
    check('streaks').notEmpty().withMessage("Category icon name is required.")
]