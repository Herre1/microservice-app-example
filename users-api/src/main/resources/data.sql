CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    role INTEGER
);


INSERT INTO users (username, firstname, lastname, role) VALUES
  ('admin', 'Foo', 'Bar', 1),
  ('johnd', 'John', 'Doe', 0),
  ('janed', 'Jane', 'Doe', 0);