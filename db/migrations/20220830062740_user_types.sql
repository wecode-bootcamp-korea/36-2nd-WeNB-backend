-- migrate:up
CREATE TABLE user_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL
);

-- migrate:down
DROP TABLE user_types;
