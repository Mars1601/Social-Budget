'use strict';

import db from '../db/db.mjs';
import crypto from 'crypto';

class UserDAO {
  //restituisce utente
  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve({ error: 'User not found' });
        else resolve(row);
      });
    });
  }

  async getUserByCredentials(username, password) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(false);
        else {
          const user = {
            username: row.username,
            name: row.name,
            surname: row.surname,
            isadmin: row.isadmin,
          };

          crypto.scrypt(password, row.salt, 64, function (err, hashedPassword) {
            if (err) reject(err);
            if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) resolve(false);
            else resolve(user);
          });
        }
      });
    });
  }
}

export default UserDAO;
