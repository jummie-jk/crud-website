const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {dbConnection} = require('./db/index')
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cors()); 

// Routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
app.get('/', (req, res) => {
    res.status(200).send({ message: ' Welcome to the blog!' });
});
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    dbConnection();
    console.log(`Server is running on http://localhost:${PORT}`);
});
