-- migrate:up
CREATE TABLE places (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, 
    price DECIMAL(12, 2) NOT NULL,
    max_capacity INT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(11, 7) NOT NULL,
    available_from DATETIME(2) NOT NULL,
    available_until DATETIME(2) NOT NULL,
    max_days INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_places_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE cascade
);

-- migrate:down
DROP TABLE places;
