//import
const exp=require('express')

//create mini express object
const userapi=exp.Router();

userapi.use(exp.json())

//import mongoClient
const mc=require("mongodb").MongoClient;

//connection string
const databaseUrl="mongodb+srv://Ajay18:Ajay18@cluster0.ikl1t.mongodb.net/userdb?retryWrites=true&w=majority"

let usercollectionObj;

//connect to db
mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{

    if(err){
        console.log("error in db creation",err);
    }
    else{
        //get database object
        let dataBaseObj=client.db("userdb")
        //create collection object
        usercollectionObj=dataBaseObj.collection("usercollection")
        console.log("connected to database")
    }
})

//exporting userapi
module.exports=userapi

//http://localhost:3000/users/getusers
/*userapi.get('/getusers',(req,res,next)=>{

    //reading documents from usercollection
    usercollectionObj.find().toArray((err,userList)=>{
            //network or other errors that might be generated
            if(err){
                console.log("err in reading user data",err);
                res.send({message:err.message})
            }
            else{
                res.send({message:userList})
            }
    })

})*/

//http://localhost:3000/users/getusers
userapi.get("/getusers",(req,res,next)=>{

    usercollectionObj.find().toArray()
       .then(userList=>res.send({message:userList}))
       .catch(err=>{
           console.log("err in reading users data",err);
           res.send({message:err.message})
       })
})

// http://localhost:3000/users/getusers/<username>
/*userapi.get('/getusers/:username',(req,res,next)=>{

    let un=req.params.username;
    //getting data of user with username as url parameter
    usercollectionObj.findOne({name:un},(err,userObj)=>{
        //network or other errors that might be generated error in communication chanel
        if(err){
            console.log("err in reading user data",err);
            res.send({message:err.message})
        }
        //if user with username is not existed
        if(userObj===null){
            res.send({message:"user not found"})
        }
        else{
            res.send({message:userObj})
        }
    })
})*/


userapi.get('/getuser/:username',(req,res,next)=>{
      let un = req.params.username;

      usercollectionObj.findOne({name:un})
      .then(userObj=>{
          if(userObj === null){
              res.send({message:"no user found"})
          }
          else{
             res.send({message:userObj})
          }
        })
      .catch(err=>{
        console.log("err in reading users data",err);
        res.send({message:err.message})
      })
})

/*// http://localhost:4000/users/createuser
userapi.post('/createuser',(req,res)=>{
      //getting user data
        let userData=req.body;
      //checking wheather user with username already existing
         usercollectionObj.findOne({name:userData.name},(err,userObj)=>{
        //network or other errors that might be generated error in communication chanel
        if(err){
            console.log("err in reading user data",err);
            res.send({message:err.message})
        }
        //if user is not existing
        if(userObj===null){
            //create new user
            usercollectionObj.insertOne(userData,(err,success)=>{
                if(err){
                    console.log("err in reading user data",err);
                    res.send({message:err.message})
                }
                else{
                    res.send({message:"user created"})
                }
            });
        }
        else{
            res.send({message:"user with user name is already existed"})
        }

      })
})*/



userapi.post('/createuser',(req,res,next)=>{

    let userData=req.body;
    usercollectionObj.findOne({name:userData.name})
     .then(userObj=>{
         if(userObj === null){
             usercollectionObj.insertOne(userData)
             .then(success=>{
                 res.send({message:"new user created"})
             })
             .catch(err=>{
                console.log("err in reading user data",err);
                res.send({message:err.message})
             })
         }
         else{
             res.send({message:"user alredy existing"})
         }
     })
     .catch(err=>{
        console.log("err in reading user data",err);
        res.send({message:err.message})
     })
})
//http://localhost:4000/users/updateuser/username
userapi.put("/updateuser/:username",(req,res)=>{
    //getting update userdata
    let updateUser=req.body;
    usercollectionObj.updateOne({name:updateUser.name},{$set:{...updateUser}},(err,success)=>{
        //network or other errors that might be generated error in communication chanel
        if(err){
            console.log("err in reading user data",err);
            res.send({message:err.message})
        }
        else{
            res.send({message:"user data updated"})
        }

    })
})

// http://localhost:4000/users/deleteuser/username
userapi.delete("/deleteuser/:username",(req,res)=>{
    let un=req.params.username;
    //checking wheatheruser is existed or not
    usercollectionObj.findOne({name:un},(err,userObj)=>{
        //network or other errors that might be generated error in communication chanel
        if(err){
            console.log("err in reading user data",err);
            res.send({message:err.message})
        }
        if(userObj===null){
            res.send({message:"user not existed"})
        }
        else{
            usercollectionObj.deleteOne({name:un},(err,success)=>{
                //network or other errors that might be generated error in communication chanel
            if(err){
                console.log("err in reading user data",err);
                res.send({message:err.message})
            }
            else{
                res.send({message:"user deleted"})
            }
            })
        }
    })
})
