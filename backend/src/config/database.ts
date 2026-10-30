
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';

// Carrega o .env que está na raiz do projeto.
dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
});

const database = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'booknest_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default database;
