const express = require('express');
const router = express.Router();
const StreakController = require('../../controllers/StreakController');
const auth = require('../../middleware/authToken')

/*
     URL:           /api/streaks/add
     METHOD:        POST
     Description:   Allows user to get stats by month
 */
router.post("/add", auth , StreakController.addStreak);


/*
     URL:           /api/streaks/average?from="date"&to="date"
     METHOD:        GET
     Description:   Allows user to get average stat for month
 */
router.get("/month", auth , StreakController.getMonthAverage);

module.exports = router;