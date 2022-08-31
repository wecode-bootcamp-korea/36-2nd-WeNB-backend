const { appDataSource } = require('./datasource');

const getPlaces = async (limit, offset) => {
    const places = await appDataSource.query(
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
        INNER JOIN images i
        ON i.place_id = p.id
        GROUP BY p.id
        ORDER BY p.id
        LIMIT ${limit}
        OFFSET ${offset}
        `);

    return places;
};

module.exports = {
    getPlaces
}