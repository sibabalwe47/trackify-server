exports.habitUnitIds = (data) => {
  if (data) {
    const uniqueIDs = new Set();
    data.forEach((d) => {
      uniqueIDs.add(d.habitId);
    });
    return uniqueIDs;
  } else {
    return new Error("Argument cannot be empty");
  }
};

exports.totalNumber = (numbers) => {
  let total = 0;
  numbers.forEach((n) => (total += n));
  return total;
};
