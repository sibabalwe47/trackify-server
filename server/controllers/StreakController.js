const asyncHandler = require("express-async-handler");
const DatabaseController = require("./DatabaseController");
const Streak = new DatabaseController("streaks");
const Habits = new DatabaseController("habits");
const Category = new DatabaseController("categories");
const HelperController = require("../helpers/HelperController");

exports.addStreak = asyncHandler(async (req, res) => {
  const { streakItems } = req.body;
  let counter = 0;

  if (streakItems) {
    // Loop through current items
    streakItems.forEach(async (item) => {
      const result = await Streak.findOne({
        recordedAt: req.body.recordedAt,
        habitId: item.habitId,
        categoryId: item.categoryId,
        userId: req.user._id,
      });
      if (result.length == 0) {
        // Add to streak table
        const streak = await Streak.create({
          recordedAt: req.body.recordedAt,
          habitId: item.habitId,
          categoryId: item.categoryId,
          userId: req.user._id,
        });
      } else {
        console.log("Already exists");
      }
    });

    return res.status(201).json({
      success: true,
      message: "Streak added successfully",
    });
  }
});

exports.getMonthAverage = asyncHandler(async (req, res) => {
  // Check if the range has data
  const streaks = await Streak.findByRange({
    field: "recordedAt",
    options: {
      from: req.query.from,
      to: req.query.to,
    },
  });

  // Test if range has data & calculate average for the range
  if (streaks.length > 0) {
    // Get streak records connected to loggedin user
    const userStreaks = streaks.filter(
      (streak) => streak.userId.toString() == req.user._id.toString()
    );

    // Remove repeating habit IDs - to get exact number of recorded habits
    const uniquedHabitIds = HelperController.habitUnitIds(userStreaks);

    // Convert set to array
    const uniqueIdsToArray = [...uniquedHabitIds];

    // Init empty habit averages array
    let habitAverages = [];

    // Loop through individual unique habit ID
    for (var i = 0; i < uniqueIdsToArray.length; i++) {
      // Store ID in variable to easily use in loop
      const id = uniqueIdsToArray[i];

      // Filter returned records to match current habit ID - and than get length of array to measure records streaks
      const numberOfStreaksInMonth = userStreaks.filter(
        (streak) => streak.habitId.toString() == id.toString()
      ).length;

      // Query habits table to get habit data
      const habit = await Habits.findOne({ id });

      // Here we get the entered streak goal for the habit in order to see how many streaks
      // have been records relative to the goal
      const streakGoal = parseInt(habit[0].streaks);

      // Calcuate the percetage
      let average = (
        (parseInt(numberOfStreaksInMonth) / parseInt(streakGoal)) *
        100
      ).toFixed(2);

      // Push the calculated percentage into the habits initiated array
      habitAverages.push(parseInt(average));
    }

    // Calculate the total of all habits streaks
    const averageTotal = HelperController.totalNumber(habitAverages);

    // Calculate streaks average for the month
    const monthAverage = Math.floor(averageTotal / uniqueIdsToArray.length);

    return res.status(201).json({
      success: true,
      data: {
        monthlyStats: monthAverage,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "The month has no habit data",
    });
  }
});

exports.getCategoryAverages = asyncHandler(async (req, res) => {
  // Get categories that belong to user
  const categories = await Category.findAll({
    userId: req.user._id,
  });

  if (categories.length > 0) {
    // Category averages
    const categoryAverages = [];

    // For each individual id, you want to get matching habits
    for (var i = 0; i < categories.length; i++) {
      // Store ID for easy use in loop
      const id = categories[i].id;

      // You want get the total streak goal from all habits
      const habits = await Habits.findAll({
        userId: req.user._id,
        categoryId: id,
      });

      const totalHabitsStreaksGoal = habits.reduce(
        (total, { streaks }) => total + streaks,
        0
      );

      // Get number times this habits connected to this category appear in the required range
      const streaks = await Streak.findAll({
        userId: req.user._id,
        categoryId: id,
      });

      const numberOfStreaksInMonth = streaks.length;

      // Calculate percentage (Number times habits connected to this category appear / Total streaks * 100)
      const categoryAverage = Math.floor(
        (numberOfStreaksInMonth / totalHabitsStreaksGoal) * 100
      );

      const category = categories.find(
        (cat) => cat.id.toString() == id.toString()
      );

      // Create an object  { category: '', stat: 12 }
      categoryAverages.push({
        category: category.name,
        monthStat: categoryAverage,
      });
    }

    // Push object into an array
    return res.status(401).json({
      success: true,
      data: categoryAverages,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "The month has no habit data",
    });
  }
});

exports.getTopRankedHabits = asyncHandler(async (req, res) => {
  res.send("Get top ranked habits");
});
