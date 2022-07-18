const express = require('express');
require('./connection/mongoose');
const app = express();
var bodyParser = require('body-parser');
const Student = require('./model/schema');
const path = require('path');
const multer = require('multer');
// const popup = require('popups');
const alert = require('alert');
const fs= require('fs');
require('dotenv');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
const dirname = path.join(__dirname);

const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dirname +'/public')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+'.jpg')
    }
  })
  
  const upload = multer({ storage: storage }).single('userimg');
  console.log(uniqueSuffix+'.jpg');





console.log(dirname);
app.use( express.static( "public" ) );

// app.use(JSON.stringify());
app.set('view engine','ejs');

const PORT = process.env.PORT || 4000;

app.get("/home",(req,res)=>{
    res.render('home');
    res.end();
});
app.post('/home',upload,async(req,res)=>{
    try { let data = new Student ({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        userimg:{
            data: fs.readFileSync(path.join(__dirname + '/public/' +req.file.filename)),
            contentType: 'image/png'
        }
    });
    // console.log(data);
    await data.save();
    res.redirect('/signin');
    
    }
    // res.end();
    catch (e){
        
            if(e.code == 11000){
                 // res.send('duplicate error'); 
                 // res.redirect('/home');
                 // console.log('erroe  e');
                 // popup.alert({content : "userdata already exist"});
                 alert('user data already exist');
                 res.redirect('/home');
     
             }
             else{
                 // console.log(e);
                 console.log('error')
             }
        
    }
    
});
app.get('/signin',(req,res)=>{
    res.render('signin');
})

app.post('/signin',async (req,res)=>{
     var data = req.body;

    // parseInt(data.password);
    console.log(data.password);
    let user = await Student.find({username:data.username});
    console.log(user);
    console.log(user[0].password);
    if(user[0].password == data.password){
        console.log("password matched");
        res.render('profile',{user});
    }
    else {
        console.log("wrong password or username");
    }
  
})
app.get('/edit/:_id',async(req,res)=>{
    let _id = req.params._id;
    let data = await Student.findById(_id);
    console.log(data);
    res.render('edit',{data});
    // res.send('edit',{data});

    // let update_data = await Student.findByIdAndUpdate({_id},{$set:{name:req.body.name,
    // username : req.body.username,
    // email:req.body.email,
    // password:req.body.password}});

    // res.redirect('/profile',{data});
})

app.post('/update/:_id',async(req,res)=>{
    let _id = req.params._id;
    let data = await Student.findById(_id);
    // res.render('edit',{data});
    let update_data = await Student.findByIdAndUpdate({_id},{$set:{name:req.body.name,
    username : req.body.username,
    email:req.body.email,
    password:req.body.password}});
    update_data.save();
    res.redirect('/signin');
    // res.send(update_data);


})
app.get('/profile',(req,res)=>{
    res.render('profile');
})
app.get('/delete/:_id',async (req,res)=>{
    let _id = req.params._id;
    let data = await Student.findByIdAndDelete(_id);
    // res.redirect('/signin');
    res.send(data);
})
app.get('/*',(req,res)=>{
    res.send(`<a href="/home">Click Here to Get Home Page </a>`);
})
// app.get('/profile',(req,res)=>{
//     res.render('profile',{data});
// })
app.listen(PORT);