import mysql from 'mysql2/promise';

export async function createConnection() {
  return await mysql.createConnection({
    host: '127.0.0.1',
    port: 13307,
    user: 'userfeedback',
    password: 'userfeedback',
    database: 'e2e',
  });
}
