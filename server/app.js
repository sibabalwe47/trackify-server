const express = require('express');
const app = express();
const db = require('./config/db');

/*
 *  Middleware
 */

app.use(express.json({extended: false}));
app.use('/api/accounts', require('./routes/api/accounts'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/habits', require('./routes/api/habits'));
app.use('/api/streaks', require('./routes/api/streaks'));

app.get('*', (req, res) => {
    res.status(401).json({
        success: false,
        message: `Endpoint ${req.protocol}://${req.get('host')}${req.url} does not exist.`
    })
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));