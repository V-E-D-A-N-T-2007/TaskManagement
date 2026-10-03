class ApiError extends Error{
    constructor(
        statusCode,
        message,
        success = "false",
        errors = []
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = success
        this.errors = errors
    }
}

export { ApiError }