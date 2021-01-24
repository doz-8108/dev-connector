const express = require("express");
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

 // separately deal with routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));   

app.get("/", (req, res) => {
   res.send("API is running.");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});