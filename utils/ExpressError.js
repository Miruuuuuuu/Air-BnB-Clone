class MyError extends Error{
    constructor(status,message)
    {
        super();
        this.status=status;
        this.message=message;
    }
}

module.exports= MyError;
// const error1=new MyError(202,"This is my error");
// console.log(error1.message);