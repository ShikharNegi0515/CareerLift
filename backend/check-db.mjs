import dbModule from 'better-sqlite3';
const db = dbModule('careerlift.sqlite');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
console.log('Tables in database:');
tables.forEach(t => console.log(' - ' + t.name));
try {
  const usersCount = db.prepare('SELECT count(*) as count FROM users').get();
  console.log('Users count:', usersCount.count);
} catch (err) {
  console.log('Users table missing or error:', err.message);
}
