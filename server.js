const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`==================================================`);
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        console.log(`==================================================`);
    });
}

module.exports = app;