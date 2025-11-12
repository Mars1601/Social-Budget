'use strict';

import db from '../db/db.mjs';

class PhaseDao {
  async getPhase() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM phases';
      db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) resolve({ phase: 0, budget: 0 });
        else resolve(row);
      });
    });
  }

  async updatePhase(phase, budget = null) {
    console.log('phase', phase);
    console.log('budget', budget);
    return new Promise((resolve, reject) => {
      if (phase !== 1) {
        const sql = 'UPDATE phases SET phase = ?';
        db.run(sql, [phase], (err) => {
          if (err) reject(err);
          else if (phase !== 3) resolve(true);
          else {
            const sql =
              'SELECT proposals.id, proposals.name, proposals.description, proposals.user, proposals.cost, SUM(preferences.vote) as score \
              FROM preferences LEFT JOIN proposals ON preferences.idproposal = proposals.id GROUP BY idproposal';
            db.all(sql, [], async (err, rows) => {
              if (err) reject(err);
              else {
                const proposalsWithVotes = rows;

                // Ordina le proposte in base alla somma dei voti decrescente e al costo crescente in caso di parità
                proposalsWithVotes.sort((a, b) => {
                  if (b.score !== a.score) {
                    return b.score - a.score; //ordina per voti decrescenti
                  } else {
                    //se le proposte hanno lo stesso numero di voti, ordina per costo crescente
                    return a.cost - b.cost;
                  }
                });

                let remainingBudget = budget;
                console.log(proposalsWithVotes);

                //cicla ogni proposta
                for (let i = 0; i < proposalsWithVotes.length; i++) {
                  const proposal = proposalsWithVotes[i];

                  //se budget rimanente è maggiore o uguale al costo della proposta
                  if (remainingBudget >= proposal.cost) {
                    // Approva la proposta
                    const sqlUpdate = 'UPDATE proposals SET isApproved = 1, score = ? WHERE id = ?';
                    await new Promise((resolveUpdate, rejectUpdate) => {
                      db.run(sqlUpdate, [proposal.score, proposal.id], (err) => {
                        if (err) rejectUpdate(err);
                        else resolveUpdate();
                      });
                    });
                    remainingBudget -= proposal.cost;
                  } else {
                    // Non approva la proposta se il budget rimanente è minore del costo della proposta
                    const sqlUpdate = 'UPDATE proposals SET isApproved = 0, score = ? WHERE id = ?';
                    await new Promise((resolveUpdate, rejectUpdate) => {
                      db.run(sqlUpdate, [proposal.score, proposal.id], (err) => {
                        if (err) rejectUpdate(err);
                        else resolveUpdate();
                      });
                    });
                  }
                }
                resolve(proposalsWithVotes);
              }
            });
          }
        });
      } else {
        console.log('updating budget');
        const sql = 'INSERT INTO phases (phase, budget) VALUES (?, ?)';
        db.run(sql, [phase, budget], (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      }
    });
  }

  async resetAll() {
    return new Promise((resolve, reject) => {
      let promises = [];
      //resetta tutte le tabelle
      const tables = ['preferences', 'proposals', 'phases'];
      for (const table of tables) {
        promises.push(
          new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${table}`;
            db.run(sql, [], (err) => {
              if (err) reject(err);
              else resolve(true);
            });
          }),
        );
      }

      Promise.all(promises)
        //resetta la tabella phases
        .then(() => {
          resolve(true);
        })
        .catch((err) => reject(err));
    });
  }
}

export default PhaseDao;
