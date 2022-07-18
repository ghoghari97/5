const mongoose= require('mongoose');

const StudentSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required : true
    },
    username:{
        type:String,
        trim:true,
        required : true,
        unique :true
    },
    email:{
        type:String,
        trim:true,
        required : true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    userimg:{
        data:Buffer,
        contentType:String
    }
});

const Student = mongoose.model('employee',StudentSchema);
module.exports = Student;