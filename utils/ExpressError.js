class ExpressError extends Error {
  constructor(statusCode = 400, message = "Something went wrong!") {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
