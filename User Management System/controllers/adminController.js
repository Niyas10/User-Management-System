
const User=require('../models/userModel')
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');


const securePassword=async(password)=>{

    try{

        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){

        console.log(error.message);
    }
}

//Load Admin Login
const loadLogin=async(req,res)=>{

    try{
        
        res.render('adminlogin',{title:'Admin Login'});
    }catch(error){

        console.log(error.message);
    }

}

//Verify Login

const verifyLogin=async (req,res)=>{

    try{

        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email});
         
        if(userData){ 

            const passwordMatch=await bcrypt.compare(password,userData.password);
            if(passwordMatch){

                if(userData.is_admin===0){

                    res.render('adminlogin',{message:'You are not Admin'})
                }else{
                     
                    req.session.admin=userData.email;
                    res.redirect('/admin/home');
                    //const usersData=await User.find({is_admin:0});
                    //res.render('adminhome',{admin:userData,users:usersData,title:'Admin Dashboard'})
                }
            }else{ 

            res.render('adminlogin',{message:"Invalid Password",title:"Admin Login"});
            }
        }else{

            res.render('adminlogin',{message:'Invalid Email or Password',title:"Admin Login"})
        }
    }catch(error){

        console.log(error.message)  
    }
}

//Load Dashboard:

const loadDashboard=async (req,res)=>{ 

    try {
       //const userData=await User.findById({_id:req.session.user_id})
        //const usersData=await User.find({is_admin:0});
        var search = ''
        if (req.query.search) {
            search = req.query.search
        }

        const userData=await User.findOne({$and:[{email:req.session.admin},{is_admin:1}]}); 
        req.session.admin=userData.email;
        const usersData=await User.find({is_admin:0,
            $or: [
                { name: { $regex: '.*' + search + '.*',$options:'i'} },
                { email: { $regex: '.*' + search + '.*',$options:'i'} }
            ]});
        
        if(req.session.admin){

            res.render('adminhome',{admin:userData,users:usersData,title:'Admin Dashboard'})
            
            
        }else{

            return res.redirect('/admin/login');
        }
            
        //res.render('adminhome');
        // const usersData=await User.find({is_admin:0});
        // console.log(usersData)
        // res.render('adminhome',{users:usersData});

        
    } catch (error) {
 
        console.log(error.message) 
        
    }


}

//logout:

const logout=async(req,res)=>{

    try{

        req.session.destroy();
        res.redirect('/admin');
        
    }catch(error){

        console.log(error.message);
    }
}

/** Add new User Load*/

const newUserLoad=async (req,res)=>{

    try{

        res.render('new-user',{title:"New User Registration"});
    }catch(error){

        console.log(error.message); 
    }
}

/** Adding User */

const addUser=async(req,res)=>{

    try{

        const name=req.body.name;
        const email=req.body.email;
        const mobno=req.body.mobno;
        const password=req.body.password;
        const secPassword=await securePassword(password);
        const user=new User({

            name:name,
            email:email,
            mobile:mobno,
            password:secPassword,
            is_admin:0
        });

        const userData=await user.save();

        if(userData){

            res.render('new-user',{message:'Registered Successfully'});
        }else{

            res.render('new-user',{message:"Something went wrong"})
        }
        

    }catch(error){
 
       console.log(error.message); 
    }
}

//edit-user Load:

const editUserLoad=async(req,res)=>{

    try{

        const id=req.query.id;
        const userData=await User.findById({_id:id});

        if(userData){

            res.render('edit-user',{user:userData,title:"Edit User"});
        }else{

            res.redirect('/admin/home')
        }
        res.render('edit-user',{title:"Edit User"})
    }catch(error){

        console.log(error.message) 
    }
}

//update User Post

const updateUsers=async(req,res)=>{

    try{

        const userData=await User.findByIdAndUpdate({_id:req.body.id},
            {$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobno}})
        res.redirect('/admin/home');
    }catch(error){

        console.log(error.message);
    }
}

//Delete User

const deleteUser=async (req,res)=>{

    try{

        const id=req.query.id;
        await User.deleteOne({_id:id});
        res.redirect("/admin/home");
    }catch(error){

        console.log(error.message);
    }
}

module.exports={

    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}