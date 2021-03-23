const { response } = require("express")
const express = require("express")
const mysql = require("mysql")
const app = express()

app.use(express.static("public"))
app.use(express.json())

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "shortulrs",
})

con.connect(function(error){
    console.log(error)
    if(error){
        console.log("DB bağlanamadı")
    }
})

app.get("/", function(request, response){
    response.sendFile(__dirname * "/public/index.html")
})

// İnsert Table Links
app.post("/api/create-short-url",function(request,response){
    let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2.10);
    let sqlQuery = `INSERT INTO links(longurl,shorturlid) VALUES('${request.body.longurl}','${uniqueID}')`
    
    con.query(sqlQuery,function(error,result){
        if(error){
            response.status(500).json({
                status : "no",
                message : "Bir hata oluştu."
            })
        } else {
            response.status(200).json({
                status: "ok",
                shorturlid : uniqueID
            })
        }
    })
});

// Get Table Links Rows;
app.get("/api/get-all-short-urls",function(request,response){
    let sqlQuery = `SELECT * FROM links`;
    con.query(sqlQuery,function(error,result){
        if(error){
            response.status(500).json({
                status : "no",
                message : "Bir hata oluştu."
            })
        } else {
            response.status(200).json(result);
        }
    })
})

app.listen(5000)