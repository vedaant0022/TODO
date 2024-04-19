
const express =require('express')
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');
const Todo = require('./Models/Todo.model');
const Registration = require('./Models/Registeration.model'); 

const dburl = process.env.MONGOURL;
mongoose.connect(dburl)
const app = express()
const port = 3000;
app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
    res.end("Server started")
})

//Signup create
app.post('/register', async (req, res) => {
    try {

      if (req.body.password !== req.body.confirmpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      const newRegistration = new Registration({
        username: req.body.username,
        password: req.body.password, 
        confirmpassword: req.body.confirmpassword, 
      });

      const savedRegistration = await newRegistration.save();
      res.status(201).json(savedRegistration);
    } catch (error) {
      if (error.code === 11000) { 
        return res.status(400).json({ message: 'Username already exists' });
      }
      res.status(500).json({ message: error.message });
    }
  });

  //Login 

  app.post('/login', async (req, res) => {
    try {
      const user = await Registration.findOne({ username: req.body.username.toLowerCase() });
  
      if (!user || user.password !== req.body.password.toLowerCase()) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      res.json({ message: 'User authenticated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


app.post('/todos', async (req, res) => {
    try {
      const newTodo = new Todo(req.body);
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.delete('/todos/delete/:title', async (req, res) => {
    try {
      const result = await Todo.deleteOne({ id: req.params.id });
  
      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Todo not found' });
      } else {
        res.status(200).json({ message: 'Todo successfully deleted' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.put('/todos/update/:title', async (req, res) => {
    try {
      const updatedTodo = await Todo.findOneAndUpdate(
        { id: req.params.id }, 
        req.body,
        {
          new: true, 
          runValidators: true 
        }
      );
  
      if (updatedTodo) {
        res.json(updatedTodo);
      } else {
        res.status(404).json({ message: 'Todo with the given title not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  


app.listen(port,()=>{
    console.log("Working ", port)
})

