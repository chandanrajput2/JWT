const router = require("express").Router();
const { check, validationResult} = require("express-validator")
const {users }=require("../db")
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");


router.post('/signup',[
    check("email","Please provide a valid email").isEmail(),
    check("password","Please provide a password that is greater then 5 characters").isLength({
        min:6
    })
    
],async (req,res)=>{
    const {password, email}=req.body;

//VALIDATED THE INPUT
   const error = validationResult(req)
   if(!error.isEmpty()){
       return res.status(400).json({
           error:error.array()
       })
   }

   //VALIDATE IF USER DOESN'T ALREADY EXIST
   let user = users.find((user)=>{
       return user.email === email

   });

   if(user){
      return res.status(400).json({
           "error": [
        {
            "msg": "This user already exists"
        }
    ]
       })
   }
   

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
        email,
        password:hashedPassword
    })
    const token = await JWT.sign({
        email
    },"Chandandandnndadgjelrjg",{
       expiresIn: 3600000  
    })
    res.json({
        token
    })
    // res.send("Validation Pass")
});

router.post('/login', async(req,res)=>{
    const{ password, email }=req.body;

    let user =users.find((user)=>{
        return user.email ===email
    });
     if(!user){
      return res.status(400).json({
           "error": [
        {
            "msg": "Invalid Credentials",
        }
    ]
       })
   };

  let isMatch = await bcrypt.compare(password,user.password)
   if(!isMatch){
      return res.status(400).json({
           "error": [
        {
            "msg": "Invalid Credentials",
        }
    ]
       })
   };
   const token = await JWT.sign({
        email
    },"Chandandandnndadgjelrjg",{
       expiresIn: 3600000  
    })
    res.json({
        token
    })

});


router.get("/all",(req,res)=>{
    res.json(users)
})


module.exports = router;