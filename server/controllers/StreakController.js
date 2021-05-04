const asyncHandler = require('express-async-handler');
const DatabaseController = require('./DatabaseController');
const Streak = new DatabaseController("streaks");
const Habits = new DatabaseController("habits");
const HelperController = require('../helpers/HelperController');

exports.addStreak = asyncHandler(async (req, res) => {
    const { streakItems } = req.body;
    let counter = 0;
    
    if(streakItems) {
        // Loop through current items
        streakItems.forEach(async (item) => {
            
            const result = await Streak.findOne({
                recordedAt: req.body.recordedAt,
                habitId: item.habitId,
                categoryId: item.categoryId,
                userId: req.user._id
            });
            if(result.length == 0) {
                
                // Add to streak table
                const streak = await Streak.create({
                    recordedAt: req.body.recordedAt,
                    habitId: item.habitId,
                    categoryId: item.categoryId,
                    userId: req.user._id
                });

            } else {
                console.log('Already exists');
            }
        });

        return res.status(201).json({
            success: true,
            message: "Streak added successfully"
        })
    }
})

exports.getMonthAverage = asyncHandler(async (req, res) => {
    const streaks = await Streak.findByRange({
        field: 'recordedAt',
        options: {
            from: req.query.from,
            to: req.query.to
        }
    })
    if(streaks.length > 0) {
        const userStreaks = streaks.filter(streak => streak.userId.toString() == req.user._id.toString());
        let habitAverages = 0;

        const uniquedHabitIds = HelperController.habitUnitIds(userStreaks);
        const uniqueIdsToArray = [...uniquedHabitIds];

        uniqueIdsToArray.forEach(async (id) => {
            // Get number of streaks in current month
            const numberOfStreaksInMonth = userStreaks.filter(streak => streak.habitId.toString() == id.toString()).length;
            // Get streak goal for this habit
            const habit = await Habits.findOne({ id });
            const streakGoal = habit[0].streaks;
            // Calculate percentage & push in habitAverages
            let average = ((parseInt(numberOfStreaksInMonth)/parseInt(streakGoal)) * 100).toFixed(2);
            habitAverages = habitAverages + average;
        });

       console.log(habitAverages)
        
        // return res.status(201).json({
        //     success: true,
        //     data: {
        //         average: HelperController.averagePercentage(habitAverages)
        //     }
        // })
        
    }
})

exports.getByCategories = asyncHandler(async (req, res) => {
    res.send('Get by categories')
})

exports.getTopRankedHabits = asyncHandler(async (req, res) => {
    res.send('Get top ranked habits')
})

