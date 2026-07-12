const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./src/routes/noteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Menyajikan file statis frontend (HTML, CSS, JS) dari folder public
app.use(express.static('public'));

// Mengarahkan URL /api/notes ke file routes kita
app.use('/api/notes', noteRoutes);

module.exports = app;