// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();

require('dotenv').config()
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
});
 

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const listId = process.env.LIST_ID;
        const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
 

    async function run() {
 
        const response = await mailchimp.lists.addListMember(listId, {
         
            email_address: subscribingUser.email,
            
            status: "subscribed",
            
            merge_fields: {
            
            FNAME: subscribingUser.firstName,
            
            LNAME: subscribingUser.lastName
            
            }
            
        });

        res.sendFile(__dirname + "/success.html")
            
        console.log(
        
            `Successfully added contact as an audience member. The contact's id is ${
            
            response.id
            
            }.`
            
        );
         

    }

    run().catch(e => res.sendFile(__dirname + "/failure.html"));
 
})


app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000...");
});


