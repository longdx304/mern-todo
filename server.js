const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const portNo = process.env.PORT || 4000;
const databaseUrl = process.env.DATABASEURL || "mongodb+srv://mern-todo:dt8aEbQ2LzMFDGfs@mern-todo-bjsjz.mongodb.net/test?retryWrites=true&w=majority";

let Todo = require("./todo.model");

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(bodyParser.json());

app.use("/todos", todoRoutes);

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

todoRoutes.route("/").get((req, res)=>{
    Todo.find((err, todos)=>{
        if(err){
            console.log(err);
        } else{
            res.json(todos);
        }
    });
});

todoRoutes.route("/:id").get((req, res)=>{
    let id = req.params.id;
    Todo.findById(id, (err, todo)=>{
        res.json(todo);
    });
});

todoRoutes.route("/add").post((req, res)=>{
    let todo = new Todo(req.body);
    todo.save()
        .then(todo =>{
            res.status(200).json({"todo": "todo added successfully"});
        })
        .catch(err=>{
            res.status(400).send("adding new todo failed");
        })
});

todoRoutes.route("/update/:id").post((req, res)=>{
    Todo.findById(req.params.id, (err, todo)=>{
        if(!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo=>{
                res.json("Todo updated");
            })
            .catch(err=>{
                res.status(400).send("Update not possible");
            });
    });
});

mongoose.connect(databaseUrl, {useNewUrlParser: true});
//mongoose.connect("mongodb://hlong304:Zxcvdef1@ds263127.mlab.com:63127/mern-todos", {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("MongoDB database connetion established succesfully ");
})

app.listen(portNo, ()=>{
    console.log("Server is running on Port: " + portNo);
});