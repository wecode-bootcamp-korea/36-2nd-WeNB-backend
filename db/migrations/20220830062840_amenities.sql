-- migrate:up
CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

-- migrate:down
DROP TABLE amenities;
