const express = require("express");
const app = express();
const https = require("https");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});


app.post("/",function(req,res){
    var firstName = req.body.fName; 
    var lastName = req.body.lName; 
    var email = req.body.email; 
    console.log(firstName + lastName + email)

    const data ={
       members :[{
        email_address : email,
        status : "subscribed",
        merge_fields : {
            FNAME : firstName,
            LNAME : lastName
        }

    }] 
    };

    const jsonData = JSON.stringify(data);
    const url ="https://us21.api.mailchimp.com/3.0/lists/28d9d60439" ;
    const options = {
        method : "POST",
        auth : "samisafe:7f8758ac2ad3340de2032ee17c38bd34-us21"
    };


    const request = https.request(url,options,function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            var codeStatus = response.statusCode;
            if (codeStatus === 200){
                res.sendFile(__dirname + "/success.html");
             }
             else {
              res.sendFile(__dirname + "/failure.html");
             }
             


        })
    });
      

   request.write(jsonData);
   request.end();

});

app.post("/failure",function(req,res){
   res.redirect("/");
});

app.listen(process.env.PORT ||3000,function(){
   console.log("server listening on port 3000");
});




// mailchimp api key : 3109d7bfbc9d3a5fea5c38d92031a005-us21

// audience id : 28d9d60439.