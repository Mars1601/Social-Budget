'use strict';

import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

const db = new sqlite.Database('./db/db.db', (err) => {
  if (err) throw err;
});

export default db;
