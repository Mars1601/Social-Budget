CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  isadmin BOOLEAN NOT NULL
);

CREATE TABLE proposals(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    cost REAL,
    user TEXT,
    score INTEGER,
    isApproved BOOLEAN,
    FOREIGN KEY (user) REFERENCES users(username)
);

CREATE TABLE preferences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vote INTEGER CHECK(vote BETWEEN 0 AND 3),
    user TEXT NOT NULL,
    idproposal INTEGER NOT NULL,
    FOREIGN KEY (user) REFERENCES users(username),
    FOREIGN KEY (idproposal) REFERENCES proposal(id)
);

CREATE TABLE phases(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phase INTEGER DEFAULT 0,
    budget INTEGER NOT NULL
    );


UPDATE 
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS phases;
INSERT INTO users (username, name, surname, password, salt, isadmin) 
VALUES ('admin', 'admin', 'admin', '16b96f0e2a1beb0607e81a48e995654774c516418867f67a9b1056356ae487567acff8d16571a9dde62497e9e19b12996d367f108865f1a0b8e5c3ce56c55869', 'abcdefghilmnopqrstuvz123', 1), 
       ('userA', 'user1', 'user1', 'f1038eedcf140e4d97aa3050a0e67a68f5d1959f01dc62d654440d7e2f9fcc19a10738808f7db04df651a8b03c2a63571f276f6a8b619131303f65e16024ee99', 'abcdefghilmnopqrstuvz123', 0), 
       ('userB', 'user2', 'user2', '3c750b47b06cc10076bbd12c3edfeb216f6503ba4e0eda0132007cc536855f4724a6161f3119459eeeaf6a5f9ae329dfe8642d93af6ed30f9226b460747ca03e', 'abcdefghilmnopqrstuvz123', 0),
       ('userC', 'user3', 'user3', '8f0ee25ea10dca0286819970fe2f71d38d3a12756572914453fa4147f0ca80784852b53c6d8e3c042d8c8dd19b0d2d4ad38259ac724587ae737cb617aa293c0f', 'abcdefghilmnopqrstuvz123', 0);
       


