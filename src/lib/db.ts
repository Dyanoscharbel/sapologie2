import mysql from 'mysql2/promise';

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sapologie',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création d'un pool de connexions
const pool = mysql.createPool(dbConfig);

export async function query(sql: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête:', error);
    throw error;
  }
}

export async function getConnection() {
  return await pool.getConnection();
}

export { pool };
