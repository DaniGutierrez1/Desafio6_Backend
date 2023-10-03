import mongoose from "mongoose";

const usersCollection = "users";

const userSchema= new mongoose.Schema({
    first_name:{
        type:String,
    },
    last_name:String,
    email:{
        type:String,
        required:true
    },
    age:Number,
    password:{
        type:String,
        required:true
    },
    role:String
});

export const usersModel = mongoose.model(usersCollection,userSchema);