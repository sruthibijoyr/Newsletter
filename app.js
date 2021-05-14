const express = require("express");
const bodyParser =require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const url = "https://us7.api.mailchimp.com/3.0/lists/580bb170d5";
  const options = {
    method: "POST",
    auth: "sruthi:86c89398ae30864001c339a3350926a4-us7"
  }

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }

      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running in port 3000");
});
