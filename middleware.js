//import
const exp=require('express')

//creating express object from exp functions
const app=exp();

//to convert json to javascript middleware
app.use(exp.json())



//middleware
app.use((req,res,next)=>{
    let dataObj=req.body;

    if(typeof dataObj.a==="number" && typeof dataObj.b === "number"){
        next();
    }
    else{
        res.send({message:"invalid type of inputs"})
    }

})


app.post('/sum',(req,res)=>{

    let obj=req.body;
    let sum = obj.a+obj.b;
    res.send({message:`Sum of two numbers is ${sum}`})
})


//assignning port number
const port=3000
app.listen(port,()=>console.log(`server is listening on port ${port}...`))
