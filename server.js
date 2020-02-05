const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res){
    //check the user's choice
    let currency = req.body.currency;
    let url = `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`;
    //get bitcoin rates from external API
    request(url, function(error, response, body){
        console.log("Status Message: ", response.statusMessage);      
        console.log("Server Status Code: ", response.statusCode);
        //server response (the data we actually need)
        console.log(response.body);

        //convert response string to json object
        let data = JSON.parse(response.body);
        let Bitcoin = parseInt(req.body.Bitcoin);
        let own;
        let price;

        if(currency === "EUR"){
            price = parseInt(data.bpi.EUR.rate);
            own = parseInt(price*Bitcoin);
            console.log("Price in EUR ", own+"K");
        } else {
            price = parseInt(data.bpi.USD.rate);
            own = parseInt(price*Bitcoin);
            console.log("Price in USD ", own+"K");
        }
        
        let disclaimer = data.disclaimer;

        res.write(`${disclaimer}`);
        res.write('<br>');
        res.write(`Current price in ${currency} is ${own}K`);
        res.send();

        
    });


});


app.listen(3000, function(){
    console.log("Server is running on port 3000");
});