class QueryResultSet {
	constructor(result) {
		this.result = result
	}

	fetchAll() {
		return this.result;
	}

 	fetchOne() {
		const [row] = this.result;

		return row
	}

 	getLastInsertedId() {
		return this.result.insertId;
	}

	getUpdatedRows() {
		return this.result.affectedRows;
	}

	isExist() {
		return Object.values(this.result[0])[0] === '0' ? false : true
	}

}

class Database {
	constructor(db) {
		this.db = db
	}

	query(query, params) {
		const result = this.db.query(query, params)
		
		return QueryResultSet(result)
	}
}

module.export = Database
