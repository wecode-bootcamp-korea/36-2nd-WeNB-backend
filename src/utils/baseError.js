class BaseError extends Error {
	constructor(name, httpStatusCode, description) {
		super(description);

		this.name = name;
		this.httpCode = httpStatusCode;

		Error.captureStackTrace(this);
	}
}

module.exports ={
    BaseError
}