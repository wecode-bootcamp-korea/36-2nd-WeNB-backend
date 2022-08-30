-- migrate:up
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    rent_from DATETIME(2) NOT NULL,
    rent_to DATETIME(2) NOT NULL,
    guest_number INT NOT NULL,
    total_price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE cascade,
    CONSTRAINT fk_bookings_place_id FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE cascade
);

-- migrate:down
DROP TABLE bookings;
