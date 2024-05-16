
/** Connect model and view with controller */
const User=require('../models/userModel');
const bcrypt=require('bcrypt');

const securePassword=async(password)=>{


    try{

        const passwordHash= await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){

        console.log(error.message)
    } 
}

const loadRegister=async(req,res)=>{

    try{
    
        res.render('registration',{title:"Registration Portal"}); 

    }catch(error){

        console.log(error.message);
    }

};

const insertUser=async(req,res)=>{

    try{
        const secPassword=await securePassword(req.body.password );
        //const secPassword=await bcrypt.hash(req.body.password,10);
        const user=new User({
                        /** eg:name="email" attribute give in ejs */
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobno, 
            password:secPassword,
            is_admin:0,
            
        })

        const userData=await user.save();

        if(userData){

            res.render('registration',{message:"You registered successfully, Please verify your email"});
        }else{

            res.render('registration',{message:"Your registration has been failed"});
        }

    }catch(error){

        console.log(error.message);
    }
}

/** Login User Methods */

const loginLoad=async(req,res)=>{

    try{

        if(req.session.user){

            res.redirect('home')
        }else{

            res.render('login',{title:'Login Page'});
        }


    }catch(error){

        console.log(error.message)
    }
}

/** Login Verification */
const verifyLogin=async (req,res)=>{

    try{

        const email=req.body.email;
        const password=req.body.password

        const userData= await User.findOne({email:email})  

        if(userData){

           const passwordMatch=await bcrypt.compare(password,userData.password);

           if(passwordMatch){
            
                req.session.user=userData.email;
                //res.redirect('/home');
                res.render('home',{user:userData,title:'User Home'})
            
           }else{ 

            res.render('login',{message:"Password not matching"}) 
           }
        }else{

            res.render('login',{message:"Invalid Email or Password"})
        }
    }catch(error){  

        console.log(error.message)
    }
}

// Load Home Page

const loadHome=async (req,res)=>{
const userData= await User.findOne({is_admin:0});
    try{

        if(req.session.user){

            res.render('home',{user:userData,title:"User Home"});
        }else{

            return res.redirect('/')
        }
    }catch(error){

        console.log(error.message);
    }
}

// User Logout

const userLogout=async(req,res)=>{  
    
    try{

        req.session.destroy(function(err){

            if(err){

                console.log(err);
            }else{

                res.redirect('/')
            }
        })
    }catch(error){

        console.log(error.message)  
    }
}

module.exports={
    
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome, 
    userLogout
}
