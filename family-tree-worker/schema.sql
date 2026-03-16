CREATE TABLE IF NOT EXISTS people (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT,
  birthYear INTEGER,
  notes     TEXT,
  addedBy   TEXT,
  addedAt   TEXT,
  editedBy  TEXT,
  editedAt  TEXT
);

CREATE TABLE IF NOT EXISTS relationships (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  fromId  TEXT NOT NULL,
  toId    TEXT NOT NULL,
  type    TEXT NOT NULL
);
