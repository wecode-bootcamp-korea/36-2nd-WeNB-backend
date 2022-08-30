-- migrate:up
CREATE TABLE images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    place_id INT NOT NULL,
    image_url VARCHAR(2083),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT place_id FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE cascade
);

-- migrate:down
DROP TABLE images;
