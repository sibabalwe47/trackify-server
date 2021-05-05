const express = require("express");
const router = express.Router();
const HabitsController = require("../../controllers/HabitsController");
const auth = require("../../middleware/authToken");
const { validateUserHabit } = require("../../middleware/validators");

/*
     URL:           /api/habits/all/category/:categoryId
     METHOD:        GET
     Description:   Allows user to get all habits
 */
router.get("/all/category", auth, HabitsController.getAll);

/*
     URL:           /api/habits/:id/category/:categoryId
     METHOD:        GET
     Description:   Allows user to get all habits
 */
router.get("/:id/category/:categoryId", auth, HabitsController.getSingle);

/*
     URL:           /api/habits/add
     METHOD:        POST
     Description:   Allows user to add habits
 */
router.post(
  "/add/:categoryId",
  validateUserHabit,
  auth,
  HabitsController.addHabit
);

/*
     URL:           /api/categories/:id
     METHOD:        POST
     Description:   Allows user to edit habits
 */
router.put("/:id/category/:categoryId", auth, HabitsController.editHabit);

/*
     URL:           /api/categories/:id
     METHOD:        DELETE
     Description:   Allows user to delete a habit
 */
router.delete("/:id/category/:categoryId", auth, HabitsController.deleteHabit);

module.exports = router;
