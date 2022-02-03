const path=__dirname;
let port=process.env.PORT;
const _=require('lodash');
const express=require('express');
const https=require('https');
const app=express();
const date=require(__dirname+'/date.js');

const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://<mongodb-user>:<password>@<cluster-name>.jvhfe.mongodb.net/<database name>',{useNewUrlParser:true});

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});
const Item=mongoose.model('Item',itemSchema);
const listSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    items:[itemSchema]
});
const List=mongoose.model('List',listSchema);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    let day=date.getDate();
    let items=[];
    Item.find({},function(err,docs){
        if(err)
            console.log(err);
        else
            items=docs;
        res.render("list",{listTitle:day,items:items,listType:"defaultList"});    
    });
});
app.post("/",(req,res)=>{
    const {listName,newItem}=req.body;
    if(listName=="defaultList"){
        const NewItem=new Item({name:newItem});
        NewItem.save().then(()=>res.redirect("/")).catch(err=>{
        console.log(err);
        res.redirect("/");
    });
    }else{
        const NewItem=new Item({name:newItem});
        List.updateOne({name:listName},{$push:{items:NewItem}},function(err,docs){
            if(err)
                console.log(err);
            res.redirect(listName);
        });
    }
});
app.get('/about',(req,res)=>{
    res.render("about");
});
app.post("/delete",(req,res)=>{
    const {defaultList,custom}=req.body;
    if(custom==undefined){
        Item.deleteOne({_id:defaultList},function(err){
            if(err)
                console.log(err);
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({"items._id":custom},{$pull:{items:{_id:custom}}},function(err,list){
            if(err)
                console.log(err)
            res.redirect("/"+list.name);
        });
    }
});
app.get("/:customListName",(req,res)=>{
    const {customListName}=req.params;
    listName=_.capitalize(_.lowerCase(customListName));
    List.findOne({name:listName},function(err,data){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            if(!data){
                const list=new List({name:listName});
                list.save().then(()=>res.redirect("/"+listName));
            }else
                res.render("list",{listTitle:data.name,items:data.items,listType:listName});
        }
    });
});
if(port==null || port=="")
    port=3000;
app.listen(port,()=>console.log(`Server is running on port ${port}`));