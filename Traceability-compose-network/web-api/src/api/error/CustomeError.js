class CustomeAPIError extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomeError = (msg, statusCode)=>{
    return new CustomeAPIError(msg, statusCode)
}

export  { createCustomeError, CustomeAPIError  }