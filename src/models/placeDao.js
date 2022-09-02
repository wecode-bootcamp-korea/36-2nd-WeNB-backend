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

module.exports = {
    getPlaces
}