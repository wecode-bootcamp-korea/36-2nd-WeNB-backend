-- migrate:up
CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    icon_image_url VARCHAR(2083) NOT NULL,
    name VARCHAR(30) NOT NULL
);



-- migrate:down
DROP TABLE amenities;
