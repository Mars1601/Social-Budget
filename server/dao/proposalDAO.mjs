import db from '../db/db.mjs';

class ProposalDAO {
  //propste approvate
  async getApprovedProposals() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM proposals WHERE isapproved = 1 ORDER BY score DESC, cost ASC`;
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getProposals() {
    const sql = 'SELECT * FROM proposals ORDER BY score DESC, cost ASC';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else resolve(rows);
      });
    });
  }

  //aggiungi nuova proposta
  async insertProposal(user, proposal) {
    return new Promise((resolve, reject) => {
      // verifica che l'utente non abbia gia inserito tre proposte
      const sqlGet = 'SELECT COUNT(*) as count FROM proposals WHERE user = ?';
      db.get(sqlGet, [user.username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row.count >= 3) {
          reject(new Error('Hai già inserito tre proposte'));
        } else {
          // prendo il budget dalla tabella phases
          const sql = 'SELECT budget FROM phases';
          db.get(sql, (err, row) => {
            if (err) {
              reject(err);
            } else {
              const budget = row.budget;
              if (proposal.cost > budget) {
                reject(new Error('Costo proposta maggiore del budget'));
                return;
              } else {
                const sql = 'INSERT INTO proposals (user, name, description, cost, score, isApproved) VALUES (?, ?, ?, ?, ?, ?)';
                db.run(sql, [user.username, proposal.name, proposal.description, proposal.cost, 0, false], function (err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(true);
                  }
                });
              }
            }
          });
        }
      });
    });
  }

  //modifica proposta
  async editProposal(user, proposal) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE proposals SET name = ?, description = ?, cost = ? WHERE id = ?';
      db.run(sql, [proposal.name, proposal.description, proposal.cost, proposal.id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async removeProposal(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM proposals WHERE id = ?';
      db.run(sql, [id.id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async removeAllProposals() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM proposals';
      db.run(sql, [], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default ProposalDAO;
