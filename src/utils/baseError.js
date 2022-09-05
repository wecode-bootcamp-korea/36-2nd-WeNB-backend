class BaseError extends Error {
	constructor(name,httpStatusCode, message) {
		super(message);

		this.name = name;
		this.statusCode = httpStatusCode;
		this.date = new Date();

		Error.captureStackTrace(this);
	}
}

module.exports = {
    BaseError
}