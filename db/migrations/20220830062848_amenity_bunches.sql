-- migrate:up
CREATE TABLE amenity_bunches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    place_id INT NOT NULL,
    amenity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_amenity_bunches_place_id FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE cascade,
    CONSTRAINT fk_amenity_bunches_amenity_id FOREIGN KEY (amenity_id) REFERENCES amenities (id) ON DELETE cascade
);

-- migrate:down
DROP TABLE amenity_bunches;
