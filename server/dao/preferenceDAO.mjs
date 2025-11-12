'use strict';

import db from '../db/db.mjs';

class PreferenceDAO {
  /*
   * Restituisce tutte le preferenze
   */
  async getPreference() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM preferences';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async insertPreference(user, voter, id, vote) {
    return new Promise((resolve, reject) => {
      //se utente è autore proposta
      if (user.username === voter) {
        reject(new Error('Non puoi votare la tua proposta'));
      } else {
        //controlla se user ha già votato la proposta
        const sqlCheck = 'SELECT * FROM preferences WHERE user = ? AND idproposal = ?';
        db.get(sqlCheck, [user.username, id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            //se ha già votato modifica il voto
            const sqlUpdate = 'UPDATE preferences SET vote = ? WHERE user = ? AND idproposal = ?';
            db.run(sqlUpdate, [vote, user.username, id], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          } else {
            //se non ha votato inserisce il voto
            const sqlInsert = 'INSERT INTO preferences (user, idproposal, vote) VALUES (?, ?, ?)';
            db.run(sqlInsert, [user.username, id, vote], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          }
        });
      }
    });
  }

  async removePreference(user, proposal) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM preferences WHERE user = ? AND idproposal = ?';
      db.run(sql, [user.username, proposal.id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default PreferenceDAO;
