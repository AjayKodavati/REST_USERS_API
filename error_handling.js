//import
const exp=require('express')

//creating express object from exp functions
const app=exp();

//to convert json to javascript middleware
app.use(exp.json())//body parcing middleware(inbuilt middleware)

let users=[];


//middleware
const checkInputs=((req,res,next)=>{
    let dataObj=req.body;

    if(typeof dataObj.a==="number" && typeof dataObj.b === "number"){
        next();
    }
    else{
        res.send({message:"invalid type of inputs"})
    }

})


app.post('/sum',checkInputs,(req,res)=>{

    let obj=req.body;
    let sum = obj.a+obj.b;
    res.send({message:`Sum of two numbers is ${sum}`})
})
//get request handler
app.get('/users',(req,res)=>{
     
    if(users.length === 0){
        res.send({message:"No Users Found"})
    }
    else{
        res.send({message:users})
    }
})

//get request having url parameters
app.get('/users/:userId',(req,res)=>{

    let uid=(+req.params.userId);

    //search for matched users
    let matchedUser=users.filter(userObj=>userObj.id === uid)

    if(matchedUser.length === 0){
        res.send({message:`user with UserID ${uid} is Not Found`})
    }
    else{
        res.send({message:matchedUser})
    }
})

//create newuser
app.post('/createuser',(req,res)=>{

    let newUser=req.body;

    //searching for user existing with already existing user
    let matchedUser=users.filter(userObj=>userObj.id===newUser.id)


    //adding new users
    if(matchedUser.length === 0){
        users=[...users,newUser]
        res.send({message:"New user created"})
    }
    else{
        res.send({message:`user already existing with id ${matchedUser[0].id}`})
    } 
})

//put request handler

app.put('/updateuser/:userID',(req,res)=>{

    let userDataUpdate=req.body;

    //finding the index of array with userId
    let ind=users.findIndex(userObj=>userObj.id === userDataUpdate.id);

    if(ind === -1){
        res.send(`No user found with ${userDataUpdate.id}`)
    }
    else{
        users.splice(ind,1,userDataUpdate)
        res.send({message:"user data updated"})
    }
})



//delete requet handler

app.delete('/removeuser/:id',(req,res)=>{

      let uid = (+req.params.id);

      let ind = users.findIndex(userObj=>userObj.id === uid)

      if(ind === -1){
        res.send({message:`No user found with ${uid}`})
      }
      else{
          users.splice(ind,1);
          res.send({message:'user deleted'})
      }
 
})

//reading data from file 
//asynchronous cosing syntax error handling
app.get('/read',(req,res,next)=>{
    let fs = require('fs')

    fs.readFile('./data.txt',(err,data)=>{
        if(err){
            res.send({message:err.message})
        }
        else{
            try{
             let fileData=data.toStrin()
             res.send({message:fileData})
            }
            catch(err){
                //forwarding error object to error handling middleware
                next(err);
            }
        }
    })
})

//invalid path handling
app.use((req,res)=>{
    res.send({message:`ivalid path`})
})


//error handling middleware  for synchronous coding
app.use((err,req,res,next)=>{

    res.send({message:err.message})
})



//assignning port number
const port=3000
app.listen(port,()=>console.log(`server is listening on port ${port}...`))
