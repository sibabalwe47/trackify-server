const express = require('express');
const router = express.Router();
const CategoriesController = require('../../controllers/CategoryController');
const auth = require('../../middleware/authToken');
const { validateUserCategory } = require('../../middleware/validators'); 


/*
     URL:           /api/categories/all
     METHOD:        POST
     Description:   Allows user to get all categories
 */
router.get("/all", auth , CategoriesController.getAll);

/*
     URL:           /api/categories/add
     METHOD:        POST
     Description:   Allows user to add categories
 */
router.post("/add", validateUserCategory, auth , CategoriesController.addCategory);

/*
     URL:           /api/categories/:id
     METHOD:        POST
     Description:   Allows user to add categories
 */
router.get("/:id", auth , CategoriesController.getSingleCategories);

/*
     URL:           /api/categories/:id
     METHOD:        PUT
     Description:   Allows user to edit categories
 */
router.put("/:id", auth , CategoriesController.editCategory);


/*
     URL:           /api/categories/:id
     METHOD:        DELETE
     Description:   Allows user to delete categories
 */
router.delete("/:id", auth , CategoriesController.deleteCategory);












module.exports = router;