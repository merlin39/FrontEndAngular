// const express = require("express");
// const bodyParser = require("body-parser");
// const sql = require("mssql");

// const app = express();
// const port = 3000;
// // const register = require("./register");
// // const login = require("./login");
// // const showuser = require("./showuser");


// app.use(bodyParser.json());


// const dbConfig = {
//   user: "Angular", 
//   password: "Pass1234", 
//   server: "WARAPHORN", 
//   database: "Angular", 
//   options: {
//     encrypt: false, 
//     trustServerCertificate: true, 
//   },
// };


// sql.connect(dbConfig)
//   .then(() => console.log("Connected to SQL Server"))
//   .catch((err) => console.error("Database connection error:", err));

// // app.post("/register", register);
// // app.post("/login", login);
// // app.get("/showuser", showuser);

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });