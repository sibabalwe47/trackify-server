exports.habitUnitIds = (data) => {
    if(data) {
        const uniqueIDs = new Set();
        data.forEach(d => {
            uniqueIDs.add(d.habitId);
        });
        return uniqueIDs;
    } else {
        return new Error("Argument cannot be empty");
    }
}

exports.averagePercentage = (numbers) => {
    console.log(numbers) 
}