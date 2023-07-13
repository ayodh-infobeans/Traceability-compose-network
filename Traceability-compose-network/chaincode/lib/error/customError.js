class CustomeAPIError extends Error {
    constructor(message){
        super(message)
    }
}

const createCustomeError = (msg)=>{
    return new CustomeAPIError(msg)
}

module.exports = { createCustomeError, CustomeAPIError };