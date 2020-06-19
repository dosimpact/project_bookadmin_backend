/**
 * Node express Server
 * cors
 * body-parser
 * bookinfo GET,POST,DELETE
 * multer file upload
 */
require("./env");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
//===============================================================DB
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  database: process.env.DATABASE,
});
connection.connect((e) => {
  if (e) {
    console.error("DB Connection fail💥");
  } else {
    console.log("DB connection is success ✔");
  }
});

//===============================================================MID
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/image", express.static("public"));
//===============================================================API
app.get("/api/hello", (req, res) => {
  res.send("Success hello ✔");
});

app.get("/api/book", (req, res) => {
  let sql = "SELECT * FROM bookDB.BookInfo WHERE isDeleted=0 limit 100;";
  connection.query(sql, (err, row, field) => {
    if (err) {
      throw Error(err);
    }
    res.send(row);
  });
});
app.post("/api/book/add", (req, res) => {
  console.log("add", req.body);
  let sql =
    "INSERT INTO bookDB.BookInfo (author,picture,publisher,name,birthday,isDeleted) VALUES (?,?,?,?,?,?)";
  const { author, picture, publisher, name, birthday } = req.body;
  connection.query(
    sql,
    [author, picture, publisher, name, birthday, 0],
    (err, rows, field) => {
      if (err) {
        throw Error(err);
      }
    }
  );

  res.send("Success");
});
const upload = multer({ dest: "public" });
app.post("/api/book", upload.single("image"), (req, res) => {
  //TODO : upload book, with multer file upload
  console.log(req.body);
  /**
   * [Object: null prototype] {
  fileName: 'C:\\fakepath\\robot-dev.png',
  author: 't3',
  picture: 't3',
  publisher: 't3',
  name: 't3',
  birthday: 't3'
}
   */
  //console.log(req.params); //{}
  console.log(req.file);
  /*{
  fieldname: 'image',
  originalname: 'robot-dev.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'public',
  filename: 'c552c52d1d750c207738420e89ebb0b0',
  path: 'public\\c552c52d1d750c207738420e89ebb0b0',
  size: 5045
} */
  const { author, publisher, name, birthday } = req.body;
  const picture = `${req.file.filename}`;

  let sql =
    "INSERT INTO bookDB.BookInfo (author,picture,publisher,name,birthday,isDeleted) VALUES (?,?,?,?,?,?)";

  connection.query(
    sql,
    [author, picture, publisher, name, birthday, 0],
    (err, rows, field) => {
      if (err) {
        throw Error(err);
      }
    }
  );

  res.end("api/book");
});

app.delete("/api/book/:id", (req, res) => {
  console.log("delete", req.params, req.body);
  const id = req.params.id;
  let sql = "UPDATE bookDB.BookInfo SET isDeleted=1 where id = ? ";
  const params = [id];
  //TODO : delete book, with book id
  connection.query(sql, params, (err, row, field) => {
    if (err) {
      throw Error(err);
    }
    res.send("Success");
  });
});
//===============================================================SERVER
app.listen(PORT, () => {
  console.log(
    `server is running at http://localhost:${PORT} ✅ power by ${process.env.NAME} ✔`
  );
});
