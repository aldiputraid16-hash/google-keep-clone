const mysql = require('mysql2');
require('dotenv').config();

// Membuat koneksi pool ke database MySQL Laragon
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fitur otomatis untuk mengecek apakah server backend bisa terhubung ke Laragon
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Koneksi ke MySQL Laragon GAGAL:', err.message);
    } else {
        console.log('Koneksi ke MySQL Laragon BERHASIL disambungkan!');
        connection.release(); // Kembalikan koneksi ke pool
    }
});

// Mengubah pool menjadi format promise agar bisa menggunakan async/await di Model nanti
module.exports = pool.promise();