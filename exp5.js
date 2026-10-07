const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Create Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// Create Model
const Student = mongoose.model("Student", studentSchema);

// Home Page
app.get("/", async (req, res) => {
    const students = await Student.find();

    let html = `
        <h1>Student Management</h1>

        <h2>Add Student</h2>
        <form action="/add" method="POST">
            Name: <input type="text" name="name"><br><br>
            Email: <input type="email" name="email"><br><br>
            Age: <input type="number" name="age"><br><br>
            <button type="submit">Add Student</button>
        </form>

        <h2>Student List</h2>
    `;

    students.forEach(student => {
        html += `
            <p>
                <b>${student.name}</b> -
                ${student.email} -
                ${student.age} years

                <a href="/delete/${student._id}">
                    Delete
                </a>
            </p>
        `;
    });

    res.send(html);
});

// CREATE
app.post("/add", async (req, res) => {
    const student = new Student({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    await student.save();

    res.redirect("/");
});

// READ
app.get("/students", async (req, res) => {
    const students = await Student.find();

    res.json(students);
});

// DELETE
app.get("/delete/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);

    res.redirect("/");
});

// UPDATE
app.post("/update/:id", async (req, res) => {
    await Student.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        }
    );

    res.redirect("/");
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});