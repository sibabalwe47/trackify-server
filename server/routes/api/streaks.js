const express = require("express");
const router = express.Router();
const StreakController = require("../../controllers/StreakController");
const auth = require("../../middleware/authToken");
const { validateUserStreakItems } = require("../../middleware/validators");

/*
     URL:           /api/streaks/add
     METHOD:        POST
     Description:   Allows user to get stats by month
 */
router.post("/add", auth, validateUserStreakItems, StreakController.addStreak);

/*
     URL:           /api/streaks/month
     METHOD:        GET
     Description:   Allows user to get average stat for month
 */
router.get("/month", auth, StreakController.getMonthAverage);

/*
     URL:           /api/streaks/categories
     METHOD:        GET
     Description:   Allows user to get average stat for month
 */
router.get("/categories", auth, StreakController.getCategoryAverages);

/*
     URL:           /api/streaks/habits
     METHOD:        GET
     Description:   Allows user to get top five performing habits
 */
router.get("/habits", auth, StreakController.getTopRankedHabits);

module.exports = router;
