const express = require("express");
const router = express.Router();
const StreakController = require("../../controllers/StreakController");
const auth = require("../../middleware/authToken");

/*
     URL:           /api/streaks/add
     METHOD:        POST
     Description:   Allows user to get stats by month
 */
router.post("/add", auth, StreakController.addStreak);

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

module.exports = router;
