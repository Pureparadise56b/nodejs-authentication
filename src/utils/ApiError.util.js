class ApiError extends Error {
  constructor(statusCode = 500, message = 'Something Went Wrong') {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}

export { ApiError }
