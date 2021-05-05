const asynHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

// Bring in db controller
const DatabaseController = require("./DatabaseController");
// Instantiate db class
const Habit = new DatabaseController("habits");

exports.addHabit = asynHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });

  const habits = await Habit.findOne({
    name: req.body.name,
    userId: req.user._id,
  });

  if (habits.length > 0)
    return res.status(401).json({
      success: false,
      message: "Habit already exists",
    });

  const results = await Habit.create({
    name: req.body.name,
    streaks: req.body.streaks,
    categoryId: req.params.categoryId,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: {
      id: results.insertId,
      name: req.body.name,
      streaks: req.body.streaks,
      categoryId: parseInt(req.params.categoryId),
    },
  });
});

exports.getAll = asynHandler(async (req, res) => {
  const results = await Habit.findAll({
    userId: req.user._id,
  });
  if (results.length == 0)
    return res
      .status(401)
      .send({ success: false, message: "User has no recorded habits yet." });
  res.json({
    success: true,
    data: results,
  });
});

exports.getSingle = asynHandler(async (req, res) => {
  const results = await Habit.findOne({
    id: req.params.id,
    categoryId: req.params.categoryId,
    userId: req.user._id,
  });
  if (results.length == 0)
    return res
      .status(401)
      .send({ success: false, message: "Habit does not exist." });
  res.json({
    success: true,
    data: {
      id: results[0].id,
      name: results[0].name,
      streaks: results[0].streaks,
      categoryId: results[0].categoryId,
    },
  });
});

exports.editHabit = asynHandler(async (req, res) => {
  const habit = await Habit.findOne({
    id: req.params.id,
    userId: req.user._id,
    categoryId: parseInt(req.params.categoryId),
  });

  if (habit.length > 0) {
    const results = await Habit.update({
      set: {
        name: req.body.name,
        streaks: req.body.streaks,
      },
      options: {
        id: req.params.id,
        userId: req.user._id,
        categoryId: req.params.categoryId,
      },
    });

    if (results.affectedRows && results.affectedRows == 0)
      return res.status(401).json({
        success: false,
        message: "Update unsuccessfully - item does not exist",
      });
    res.status(201).json({
      success: true,
      message: "Updated successfully",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Update unsuccessfully - item does not exist",
    });
  }
});

exports.deleteHabit = asynHandler(async (req, res) => {
  const results = await Habit.findOne({
    id: req.params.id,
    userId: req.user._id,
    categoryId: parseInt(req.params.categoryId),
  });

  if (results.length == 0)
    return res.status(401).json({
      success: false,
      message: "Delete unsuccessful - item does not exist",
    });

  const deletedItem = await Habit.delete({
    id: req.params.id,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Deleted successfully",
  });
});
