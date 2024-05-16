const mongoose=require('mongoose');
/** Connecting with MongoDB */
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system").then((resolve)=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
})



const express=require("express");
const path=require('path')
const user_route = require('./routes/userRoute'); 
const app=express();



const nocache=require('nocache');



const port=process.env.PORT||3001



/** For User Route */
const userRoute=require('./routes/userRoute');
app.use('/',userRoute);
app.use(express.json())
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'/public/assets')));



app.use(nocache());
/** For Admin Route */

const adminRoute=require('./routes/adminRoute');
app.use('/admin',adminRoute);



app.listen(port,()=>{console.log(`Server live at:http://localhost:${port}`)}) 