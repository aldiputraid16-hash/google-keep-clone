const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// HANYA jalankan server jika file ini dieksekusi langsung oleh node (bukan oleh jest)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`==================================================`);
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        console.log(`==================================================`);
    });
}

// EKSPOR app agar bisa dibaca oleh supertest
module.exports = app;