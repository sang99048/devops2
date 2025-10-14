const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const exportRoute = require('./router/export.route')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json())

connectDb();
app.use('/api/v1/', exportRoute)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});