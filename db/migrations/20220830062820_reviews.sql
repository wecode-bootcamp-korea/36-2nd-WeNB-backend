-- migrate:up
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    place_id INT NOT NULL,
    rate DECIMAL(2,1) NULL,
    comment VARCHAR(3000) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_booking_id FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE cascade,
    CONSTRAINT fk_reviews_place_id FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE cascade
);

-- migrate:down
DROP TABLE reviews;
