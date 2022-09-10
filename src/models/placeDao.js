const { appDataSource } = require('./datasource');

const getPlaces = async (limit, offset) => {
    const places = await appDataSource.query(
        `SELECT
            p.id,
            p.name,
            p.price,
            p.latitude,
            p.longitude,
            p.available_from,
            p.available_until,
            JSON_ARRAYAGG(
                i.image_url
            ) AS image_urls
        FROM places p
        INNER JOIN images i
        ON i.place_id = p.id
        GROUP BY p.id
        ORDER BY p.id
        LIMIT ${limit}
        OFFSET ${offset}
        `);


    const rates = await appDataSource.query(
        `SELECT
            p.id,
            JSON_ARRAYAGG(
                r.rate
            ) AS rates
        FROM reviews r
        JOIN places p
        ON p.id = r.place_id
        GROUP BY p.id
        ORDER BY p.id
        LIMIT ${limit}
        OFFSET ${offset}
        `);

    rates.map((obj) => {
        obj.average_rate = parseFloat( (obj.rates.reduce((a,b) => a + b, 0) / obj.rates.length).toFixed(1) );
    });

    places.map((obj) => {
        if (!rates[places.indexOf(obj)]) {
            obj.average_rate = 0;
        } else {
            obj.average_rate = rates[places.indexOf(obj)].average_rate;
        }
    });

    return places;
};


const getPlaceByPlaceId = async (place_id) => {
    const place = await appDataSource.query(
        `SELECT
            p.id,
            p.name,
            p.price,
            p.max_capacity,
            p.latitude,
            p.longitude,
            p.available_from,
            p.available_until,
            p.max_days,
            JSON_ARRAYAGG(
                i.image_url
            ) AS image_urls
        FROM places p
        JOIN images i
        ON i.place_id = p.id
        WHERE p.id = ${place_id}
        GROUP BY p.id
        ORDER BY p.id
        `);

    const amenities = await appDataSource.query(
        `SELECT
            a.id,
            a.name,
            a.icon_image_url
        FROM amenities a
        JOIN amenity_bunches ab
        ON ab.amenity_id = a.id
        WHERE ab.place_id = ${place_id}`
    );

    const reviews = await appDataSource.query(
        `SELECT
            r.id,
            r.rate,
            r.comment
        FROM reviews r
        JOIN places p
        ON p.id = r.place_id
        WHERE p.id = ${place_id}
        ORDER BY r.id
        `);

        if (reviews.length != 0) {
            place[0].reviews = reviews;    
        }

        if (amenities.length != 0) {
            place[0].amenities = amenities;
        }

    return place;
};


const postPlace = async (user_id, name, price, max_capacity, latitude, longitude, available_from, available_until, max_days) => {
    const postPlace = await appDataSource.query(
        `INSERT INTO places(
            user_id,
            name,
            price,
            max_capacity,
            latitude,
            longitude,
            available_from,
            available_until,
            max_days
        ) VALUES (?,?,?,?,?,?,?,?,?)
        `,
        [user_id, name, price, max_capacity, latitude, longitude, available_from, available_until, max_days]
    );

    return postPlace.insertId;
};

const postImages = async (images, place_id) => {
    images.map(async (e) => {
        await appDataSource.query(
            `INSERT INTO images(
                place_id,
                image_url
            ) VALUES (? , ?)
            `,
            [place_id, e]
        );
    });
};

const postAmenityBunches = async (place_id, amenity_ids) => {
    amenity_ids.map(async (e) => {
        await appDataSource.query(
            `INSERT INTO amenity_bunches(
                place_id,
                amenity_id
            ) VALUES (?, ?)
            `,
            [place_id, e]
        );
    });
};

const getPlaceIds = async () => {
    const getPlaceIds = await appDataSource.query(
        `SELECT
            JSON_ARRAYAGG(
                p.id
            ) AS place_ids
        FROM places p
        `);
    
    return getPlaceIds[0].place_ids;
};

const hasUserId = async (user_id) => {
    const hasUserId = await appDataSource.query(
        `SELECT EXISTS(
            SELECT *
            FROM users
            WHERE users.id = ${user_id}
        )`
    );

    return Object.values(hasUserId[0])[0];
};

const getUserTypeId = async (user_id) => {
    const getUserTypeId = await appDataSource.query(
        `SELECT
            users.user_type_id
        FROM users
        WHERE users.id = ${user_id}
        `);

    return getUserTypeId[0].user_type_id;
};

const deletePlaceWithPlaceId = async (place_id) => {
    const deletePlaceWithPlaceId = await appDataSource.query(
        `DELETE FROM places p
        WHERE p.id = ${place_id}
        `);

    return deletePlaceWithPlaceId;
};

const getReviewsByPlaceId = async (place_id) => {
    const getReviewsByPlaceId = await appDataSource.query(
        `SELECT
            r.rate,
            r.comment
        FROM reviews r
        JOIN places p
        ON p.id = r.place_id
        WHERE p.id = ${place_id}
        `);

        return getReviewsByPlaceId;
};

const postReviews = async (booking_id, place_id, rate, comment) => {
    const postReviews = await appDataSource.query(
        `INSERT INTO reviews(
            booking_id,
            place_id,
            rate,
            comment
        ) VALUES (?, ?, ?, ?)
        `,
        [booking_id, place_id, rate, comment]
    );

    return postReviews;
};

const getAmenities = async () => {
    const getAmenities = await appDataSource.query(
        `SELECT
            a.id,
            a.name,
            a.icon_image_url
        FROM amenities a`
    );

    return getAmenities;
};

const searchWithPriceRangeAndAmenities = async (minimum_price, maximum_price, amenity_ids) => {
    const num_amenity_ids = amenity_ids.map((e) => Number(e));

    let product_info;

    if (amenity_ids.length == 0) {
        product_info = await appDataSource.query(
            `SELECT 
                p.id,
                p.price
            FROM places p 
            GROUP BY p.id
            ORDER BY p.id
            `
        )
    } else {
        product_info = await appDataSource.query(
            `SELECT 
                p.id,
                p.price, 
                JSON_ARRAYAGG(
                    a.name
                ) AS amenity_names, 
                JSON_ARRAYAGG(
                    a.id
                ) AS amenity_ids
            FROM places p 
            JOIN amenity_bunches ab 
            ON ab.place_id = p.id 
            JOIN amenities a 
            ON a.id = ab.amenity_id 
            WHERE a.id IN (${String(num_amenity_ids)})
            GROUP BY p.id
            HAVING COUNT(*) = ${num_amenity_ids.length}
            ORDER BY p.id
            `);
    }

    const products = product_info.filter((obj) => {
        return (Number(obj.price) > minimum_price && Number(obj.price) < maximum_price);
    });

    if (products.length == 0) {
        return products;
    }

    const product_ids = [];
    products.map((obj) => {
        product_ids.push(obj.id);
    });

    const result = await appDataSource.query(
        `SELECT
            p.id,
            p.name,
            p.price,
            p.latitude,
            p.longitude,
            p.available_from,
            p.available_until,
            JSON_ARRAYAGG(
                i.image_url
            ) AS image_urls
        FROM places p
        JOIN images i
        ON i.place_id = p.id
        WHERE p.id IN (${String(product_ids)})
        GROUP BY p.id
        ORDER BY p.id
        `);

    return result;
};

module.exports = {
    getPlaces,
    getPlaceByPlaceId,
    postPlace,
    postImages,
    postAmenityBunches,
    getPlaceIds,
    hasUserId,
    getUserTypeId,
    deletePlaceWithPlaceId,
    getReviewsByPlaceId,
    postReviews,
    searchWithPriceRangeAndAmenities,
    getAmenities
}
