CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password TEXT,
    grade INTEGER
);

CREATE TABLE subjects(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(50)
);

CREATE TABLE study_sessions(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    start_time TIMESTAMP,
    duration INTEGER,
    notes TEXT
);