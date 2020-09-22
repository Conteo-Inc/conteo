-- Up
CREATE TABLE Person (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
);

CREATE TABLE Vehicle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT,
    model TEXT,
    ownerId INTEGER KEY REFERENCES Person(id)
);

INSERT INTO Person (name, email) VALUES ('bruno', 'bruno@email.email');
INSERT INTO Person (name, email) VALUES ('carl', 'carl@email.email');

INSERT INTO Vehicle (brand, model, ownerId) values ('audi', 'r8', 1);
INSERT INTO Vehicle (brand, model, ownerId) values ('audi', 'r6', 1);
INSERT INTO Vehicle (brand, model, ownerId) values ('mercedes', 'benz', 2);



-- Down
DROP TABLE Person;
DROP TABLE Vehicle;