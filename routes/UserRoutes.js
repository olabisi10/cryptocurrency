const router = require('express').Router();
const express = require('express');
const path = require('path');
const multer_upload = require("multer");
const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv');
const verify_token = require('./verifyToken');
const pool = require('../model/userdb');

dotenv.config();




cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret:process.env.CLOUD_API_SECRET 
  });




const upload =  multer_upload({
    dest:'./upload/images',

    
})




router.post("/userprofile",verify_token,upload.single('profile') ,async(req,res) =>{
   
    try{
     const client = await pool.connect();
    const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
    const user = data.rows;

         
            
         const result = await cloudinary.uploader.upload(req.file.path,{
             public_id:`${user_id}_profile`,
             width:500,
             height:500,
             crop: 'fill'
         })
         res.json(result)
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const  avatar = result.secure_url
       const cloudinary_user_id = result.public_id
       const fname = req.body.fname
       const lname = req.body.lname
       const gender = req.body.gender
       const phoneno = req.body.phoneno
       const email = req.body.email
 
       

       const _ = await pool.query("UPDATE users SET avatar = $1, cloudinary_user_id = $2,fname = $3,lname = $4, gender = $5, phoneno = $6 , email = $7 WHERE user_id = $8",[avatar,cloudinary_user_id,fname,lname,gender,phoneno,email,user[0].user_id] );
        

    }catch(err){

        console.log(err)
    }

    
});

///................KYC VERIFICATION START.............................////

router.post("/bvnDetails",verify_token,async(req,res) =>{
   
    const bvnno = req.body.binno
    const dob = req.body.dob

    try{
        const client = await pool.connect();
        const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
        const user = data.rows;
        console.log(user)
    
        
        const _ = await pool.query("UPDATE users SET bvn_no = $1, dob = $2 WHERE user_id = $3 ",[bvnno,dob,user[0].user_id] );
        
        res.status(200).json({
            message: "Successful",
           data :{
              username:user[0].fname
              }
         
         
           });
    }
    catch(error){
        res.json(error.message);
    }

    
});

router.post("/ninfrontview", verify_token,upload.single('ninfront') ,async(req,res) =>{
   
    try{


        const client = await pool.connect();
        const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
        const user = data.rows;

         const result = await cloudinary.uploader.upload(req.file.path)
          
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const  nin_doc_url = result.secure_url
       const cloudinary_user_id = result.public_id
       const ninno = req.body.ninno
       const residental_address = req.body.residental_address
       const state_of_residence = req.body.state_of_residence
         
      

       const _ = await pool.query("UPDATE users SET nin_doc_url= $1 , cloudinary_user_id= $2 , nin_no= $3, resident_address= $4 WHERE user_id =$5; ",[nin_doc_url,cloudinary_user_id,ninno,residental_address,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })


    }catch(err){

        console.log(err)
    }

    
});

router.post("/internationalfrontview", verify_token,upload.single('internationalfront') ,async(req,res) =>{
   
    try{


        const client = await pool.connect();
        const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
        const user = data.rows;

         const result = await cloudinary.uploader.upload(req.file.path)

        //  const result = await cloudinary.uploader.upload(req.file.path)
        //  res.json(result)
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const inter_doc1_url = result.secure_url
       const cloudinary_user_id = result.public_id
       const international_ID = req.body.international_ID
       const residental_address = req.body.residental_address
       const state_of_residence = req.body.state_of_residence
         
        


       
       const _ = await pool.query("UPDATE users SET inter_doc1_url= $1 , cloudinary_user_id= $2 , inter_id_no= $3, resident_address= $4 WHERE user_id =$5; ",[inter_doc1_url,cloudinary_user_id,international_ID,residental_address,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })


    }catch(err){

        console.log(err)
    }

    
});

router.post("/internationalbackview", verify_token,upload.single('internationalback') ,async(req,res) =>{
   
    try{
        const client = await pool.connect();
        const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
        const user = data.rows;

         const result = await cloudinary.uploader.upload(req.file.path)
         res.json(result)
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const  inter_doc2_url = result.secure_url
       const cloudinary_user_id = result.public_id



        
       const _ = await pool.query("UPDATE users SET inter_doc2_url= $1  WHERE user_id =$2; ",[ inter_doc2_url ,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })
        

    }catch(err){

        console.log(err)
    }

    
});

router.post("/driverlicensefrontview", verify_token,upload.single('driverlicensefront') ,async(req,res) =>{
   
    try{


        const client = await pool.connect();
        const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
        const user = data.rows;

        const result = await cloudinary.uploader.upload(req.file.path)
    
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const driver_doc1_url = result.secure_url
       const cloudinary_user_id = result.public_id
       const driverlicense = req.body.driverlicense
       const residental_address = req.body.residental_address
       const state_of_residence = req.body.state_of_residence
         


       const _ = await pool.query("UPDATE users SET driver_doc1_url= $1 , cloudinary_user_id= $2 , driver_id_no= $3, resident_address= $4 WHERE user_id =$5; ",[driver_doc1_url,cloudinary_user_id,driverlicense,residental_address,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })
        

    }catch(err){

        console.log(err)
    }

    
});



router.post("/driverlicensebackview", verify_token,upload.single('driverlicenseback') ,async(req,res) =>{
   
    try{

         const result = await cloudinary.uploader.upload(req.file.path)
         res.json(result)
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const  avatar = result.secure_url
       const cloudinary_user_id = result.public_id


       const _ = await pool.query("UPDATE users SET inter_doc2_url= $1  WHERE user_id =$2; ",[ inter_doc2_url ,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })
        

    }catch(err){

        console.log(err)
    }

    
});
router.post("/votersfrontview", verify_token,upload.single('votersfront') ,async(req,res) =>{
   
    try{

        const client = await pool.connect();
        const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [req.user.phoneno]);
        const user = data.rows;

         const result = await cloudinary.uploader.upload(req.file.path)
         res.json(result)
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const  voter_doc1_url = result.secure_url
       const cloudinary_user_id = result.public_id
       const votersid= req.body.votersid
       const residental_address = req.body.residental_address
       const state_of_residence = req.body.state_of_residence



       const _ = await pool.query("UPDATE users SET voter_doc1_url= $1 , cloudinary_user_id= $2 , driver_id_no= $3, resident_address= $4 WHERE user_id =$5; ",[voter_doc1_url,cloudinary_user_id,votersid,residental_address,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })
         
        

    }catch(err){

        console.log(err)
    }

    
});



router.post("/votersbackview", verify_token,upload.single('votersback') ,async(req,res) =>{
   
    try{

         const result = await cloudinary.uploader.upload(req.file.path)
         res.json(result)
        // const result = await cloudinary.uploader.upload(req.file.path)
        // res.json(result) 
        
       const  voter_doc2_url = result.secure_url
       const cloudinary_user_id = result.public_id
        



       const _ = await pool.query("UPDATE users SET voter_doc2_url= $1  WHERE user_id =$2; ",[ voter_doc2_url ,user[0].user_id] );

         

       res.status(200).json({
        message: "Successful",
       data :{
          username:user[0].fname
          }
       })

    }catch(err){

        console.log(err)
    }

    
});

const  {

    regUsers,
    userLogin,
    verifyingOtp,
    UsersnameProfile,
    del_users,
    ResendOtp,
    addDebitCard,
    makeTransfer_showsuba_acct_detail,
    showuserDebitCard,
    fundacct,
    userdashboardget,
   
    getProfile,
    user_bank_settingsget,
    user_bank_settingspost,
    start_saving_goalsget,
    increase_your_limitsget,
    create_a_planget,
    invite_a_friend,
    regUsers_blog_admin,
    adminLoginblog,
    UsersSetUpProfile,
    calsavings_daily

} =  require ("./auth")

router.route("/register").post(regUsers)
router.route("/login").post(userLogin)
router.route("/verifyOtp").post(verifyingOtp)
router.route("/resendotp").post(ResendOtp)
router.route("/").post(UsersnameProfile)
router.route("/UsersSetUpProfile").post(UsersSetUpProfile)




router.route("/showuserDebitCard").get(verify_token,showuserDebitCard)
router.route("/addDebitCard").post(verify_token,addDebitCard)
router.route("/makeTransfer_showsuba_acct_detail").get(verify_token,makeTransfer_showsuba_acct_detail)
router.route("/user_bank_settingsget").get( verify_token,user_bank_settingsget)
router.route("/user_bank_settingspost").post( verify_token,user_bank_settingspost)
router.route("/registerblog").post(regUsers_blog_admin)
router.route("/adminLoginblog").post(adminLoginblog)

router.route("/calsavings").post(calsavings_daily)
router.route("/deleteuser").delete(del_users)
module.exports = router;