const mongoose = require('mongoose')    

const registerationSchema = new mongoose.Schema(
    {
        username:
        {
            type:String,
            lowercase:true,
            unique:true

        },
        password:
        {
            type:String,
            lowercase:true
        },
        confirmpassword:
        {
            type:String,
            lowercase:true
        }
    }
)

module.exports =  mongoose.model( 'Registeration'  ,  registerationSchema)