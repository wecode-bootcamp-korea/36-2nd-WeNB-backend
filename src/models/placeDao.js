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

module.exports = {
    getPlaces,
    getPlaceByPlaceId
}