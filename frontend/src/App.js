import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    courses: []
  });

  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  /* Fetch courses */
  useEffect(() => {
    axios
      .get("http://localhost:5000/all-courses")
      .then(res => setAllCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  /* Handle input */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Select multiple courses */
  const handleCourse = (id) => {
    setForm(prev => {
      const exists = prev.courses.includes(id);
      return {
        ...prev,
        courses: exists
          ? prev.courses.filter(c => c !== id)
          : [...prev.courses, id]
      };
    });
  };

  /* Register */
  const register = async () => {
    try {
      await axios.post("http://localhost:5000/register", form);
      alert("Registered!");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  /* View courses */
  const viewCourses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/courses/${form.email}`
      );
      setMyCourses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch courses");
    }
  };

  return (
    <div className="container">
      <h2>Course Registration</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <h3>Select Courses</h3>

      <div className="course-list">
        {allCourses.map(course => (
          <div key={course.id}>
            <input type="checkbox" onChange={() => handleCourse(course.id)} />
            {course.course_name}
          </div>
        ))}
      </div>

      <button onClick={register}>Register</button>
      <button onClick={viewCourses}>View My Courses</button>

      <ul>
        {myCourses.map((c, i) => (
          <li key={i}>{c.course_name}</li>
        ))}
      </ul>
    </div>
  );
}  

export default App;