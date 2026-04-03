const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/all-courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});


app.post("/register", (req, res) => {
  const { name, email, password, courses } = req.body;

  const sql = "INSERT INTO students (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.send(err);

    const studentId = result.insertId;

    courses.forEach(courseId => {
      db.query(
        "INSERT INTO registrations (student_id, course_id) VALUES (?, ?)",
        [studentId, courseId]
      );
    });

    res.send("Registered Successfully");
  });
});


app.get("/courses/:email", (req, res) => {
  const email = req.params.email;

  const sql = `
    SELECT courses.course_name
    FROM registrations
    JOIN students ON registrations.student_id = students.id
    JOIN courses ON registrations.course_id = courses.id
    WHERE students.email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));