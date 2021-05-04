const connection = require('../config/db');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

// Database connection
const db = connection();
// Bring in db controller
const DatabaseController = require('./DatabaseController');
// Instantiate db class
const database = new DatabaseController("categories", "userId");


exports.addCategory  = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    // Return error containing missing information from fields
    if(!errors.isEmpty()) return res.status(400).json({
        success: false,
        errors: errors.array()
    });

    const categories = await database.findOne({
        name: req.body.name
    });

    if(categories.length > 0) return res.status(401).json({
        success: false,
        message: 'Category already exists'
    });

    const results = await database.create({
        name: req.body.name,
        icon: req.body.icon,
        userId: req.user._id
    });

    res.status(201).json({
        success: true,
        data: {
            id: results.insertId,
            name: req.body.name,
            icon: req.body.icon
        }
    })
});

exports.getAll = asyncHandler(async (req, res) => {
   const results = await database.findAll({
    userId: req.user._id
 });
   if(results.length == 0) return res.status(401).send({ success: false, message: 'User has no categories yet.' })
   res.json({
       success: true,
       data: results
   })
})

exports.getSingleCategories  = asyncHandler(async (req, res) => {
    const results = await database.findOne({
        id: req.params.id,
        userId: req.user._id
    });
    if(results.length == 0) return res.status(401).send({ success: false, message: "Category does not exist" })
    res.json({ success: true, data: {
        id: req.params.id,
        name: results[0].name,
        icon: results[0].icon
    } })
});


exports.editCategory  = asyncHandler(async (req, res) => {
    const results = await database.update({
        set: {
            name: req.body.name,
            icon: req.body.icon,
        },
        options: {
            id: req.params.id,
            userId: req.user._id,
        }
    });
    if(results.affectedRows && results.affectedRows == 0) return res.status(401).json({
        success: false,
        message: 'Update successfully - item does not exist'
    })
    res.status(201).json({
        success: true,
        message: 'Updated successfully'
    })
});


exports.deleteCategory  = asyncHandler(async (req, res) => {
    const results = await database.findOne({
        id: req.params.id,
        userId: req.user._id
    });


    if(results.length == 0) return res.status(401).json({
        success: false,
        message: "Delete unsuccessful - item does not exist"
    })

    const deletedItem = await database.delete({
        id: req.params.id,
        userId: req.user._id
    });

    res.status(201).json({
        success: true,
        message: 'Deleted successfully'
    })
});




