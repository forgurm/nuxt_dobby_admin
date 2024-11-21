import { createPool } from 'mysql2/promise';

// 싱글톤 패턴으로 커넥션 풀 관리
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 커넥션 풀 상태 모니터링
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

export default pool; 