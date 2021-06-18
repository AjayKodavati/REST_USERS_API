//import
const exp=require('express')

//create mini express object
const productsapi=exp.Router();

//export
module.exports=productsapi;

//data parcing middleware
productsapi.use(exp.json())

//importing mongoclient
const mc=require('mongodb').MongoClient;

const producturl="mongodb+srv://Ajay18:Ajay18@cluster0.ikl1t.mongodb.net/userdb?retryWrites=true&w=majority";

let productcollectionObj;

//connecting to db
mc.connect(producturl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
     
    //dealing with error
    if(err){
        console.log("err in connecting to database",err);
    }
    else{
        //getting database object
        let dataBaseObj=client.db('userdb');
        productcollectionObj=dataBaseObj.collection('productscollection');
        console.log("data base connected");
    }
})

// http://localhost/4000/products/getproducts

productsapi.get('/getproducts',(req,res,next)=>{

    productcollectionObj.find().toArray((err,productsObj)=>{

        //network or other errors in reading data from database
        if(err){
            console.log("error in reading data form db");
            res.send({message:err.message})
        }
        else{
            res.send({message:productsObj});
        }
    })
})

// http://localhost:4000/products/<product-name>

productsapi.get('/getproducts/:productname',(req,res,next)=>{

    //gettign product name
    let pn=req.params.productname;

    productcollectionObj.findOne({productname:pn},(err,productObj)=>{
        //network or other errors in reading data from database
        if(err){
            console.log("error in reading data form db");
            res.send({message:err.message})
        }
        //if product not found
        if(productObj === null){
            res.send({message:"product not found"})
        }
        else{
            res.send(productObj);
        }

    })
})

// http:localhost:4000/products/createproduct;

productsapi.post('/createproduct',(req,res,next)=>{

    //getting product object
    let product=req.body;

    productcollectionObj.findOne({productname:product.productname},(err,productObj)=>{
        //network or other errors in reading data from database
        if(err){
            console.log("error in reading data form db1");
            res.send({message:err})
        }
        if(productObj === null){
            productcollectionObj.insertOne(product,(err,success)=>{
            //network or other errors in reading data from database
            if(err){
                console.log("error in reading productdata");
                res.send({message:err.message})
            }
            else{
                res.send({message:"product added successfully"});
             }
            });
        }
        else{
            res.send({message:"product already existing"});
        }
    })

})

// http://localhost/products/updateproduct/product-name
productsapi.put("/updateproduct/:productname",(req,res)=>{
    //getting update userdata
    let productObj=req.body;
    productcollectionObj.updateOne({productname:productObj.productname},{$set:{...productObj}},(err,success)=>{
        //network or other errors that might be generated error in communication chanel
        if(err){
            console.log("err in reading products data",err);
            res.send({message:err.message})
        }
        else{
            res.send({message:"product data updated"})
        }

    })
})


// http://localhost:4000/products/deleteproducts/product-name
productsapi.delete('/deleteproduct/:productname',(req,res,next)=>{
    let pn=req.params.productname;

    productcollectionObj.findOne({productname:pn},(err,productObj)=>{
        //network or other errors that might be generated error in communication chanel
        if(err){
            console.log("err in reading products data",err);
            res.send({message:err.message})
        }
        if(productObj === null){
            res.send({message:"product found"})
        }
        else{
            productcollectionObj.deleteOne({productname:pn},(err,success)=>{
            //network or other errors that might be generated error in communication chanel
            if(err){
                console.log("err in deleting product data",err);
                res.send({message:err.message})
            }
            else{
                res.send({message:"product deleted"})
            }
            })
        }
    })
})
