const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/senza').then(()=>{
    console.log('connection established...');
}).catch((e)=>{
    console.log(e);
})
