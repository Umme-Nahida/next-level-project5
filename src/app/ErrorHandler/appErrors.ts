class AppError extends Error{
    public statusCode: number;

    constructor(status:number , message:string, stack= ''){
        super(message) // throw new Error(message)
        this.statusCode = status

        if(stack){
            this.stack = stack
        }else{
            // capture the error stack and keeping bydefault stack
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError;