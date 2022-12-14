const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { response } = require("express");
// const path = require("path")

const port = 8000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/views'));

mongoose.connect("mongodb+srv://admin-hari:Hari1234@cluster0.v5wilz5.mongodb.net/testDB", {useNewUrlParser: true});

const studentScheema = new mongoose.Schema({
    name: String,
    mail: String,
    dno: String,
    dept: String,
    category: String,
    staff: String,
    message: String
})
const Student = new mongoose.model("Student", studentScheema);


app.get("/", (req, res) => {
    if(req.query.already != null){
        console.log(req.query.already);
        res.render("home", {alert_msg:"Name already exits"})
    }
    else{
        res.render("home",{alert_msg:null});
    }
})

app.post("/", (req, res) => {
    let body = req.body;
    const student = new Student({
        name: body.name,
        mail: body.mail,
        dno: body.dno,
        dept: body.dept
    })

    Student.find({dno : student.dno}, function (err, docs) {
        if (docs.length){
            // console.log('Name exists already');
            res.redirect("/?already="+true);
        }else{
            student.save();
            console.log("Inserted succesfully.");
            res.redirect("/suggest?dno="+student.dno);
        }
    })
})

app.get("/suggest", (req, res) => {
    console.log(req.query.dno);  
    res.render("suggest",{dno: req.query.dno});
}) 

app.post("/suggest", (req, res) => {
    let update = {
        "category": req.body.category,
        "message": req.body.message
    };

    if(req.body.category == "faculty"){
        update["staff"] = req.body.staff;
    }
    
    console.log(update);

    Student.updateOne({"dno": req.body.dno}, update, (err, docs) => {
        if(err){
            console.log("Error occured!, document not updated!");
        }
        else{
            console.log(docs);
        }
    });
    mongoose.connection.close();
    res.render("success");
}) 

app.listen(process.env.PORT || port, function(){
    console.log("server running at:"+port);
});
