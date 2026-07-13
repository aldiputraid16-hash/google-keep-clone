const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./src/routes/noteRoutes');
const labelRoutes = require('./src/routes/labelRoutes'); // <-- 1. TAMBAHKAN INI

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Menyajikan file statis frontend
app.use(express.static('public'));

app.use('/api/notes', noteRoutes);
app.use('/api/labels', labelRoutes); // <-- 2. TAMBAHKAN INI

module.exports = app;