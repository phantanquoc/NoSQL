// import cac module:
const express =require("express");
const  mongoose = require ("mongoose");
const app =express();

// port cua server;

const SERVER_PORT =3000;

// cau hinh monggodb;

const DATABASE_URL ="mongodb+srv://phantanquoc:01277277368@cluster0.pppdzz8.mongodb.net/sensor";
const DATABASE_CONNECT_OPTION ={
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// tao ket noi monggo

mongoose.connect (DATABASE_URL,DATABASE_CONNECT_OPTION);

// kiem tra ket noi 

mongoose.connection.on("connected",function(){
    console.log("Connected to database");
});
mongoose.connection.on("disconnected",function(){
    console.log("Can not connected to database");
});

// tao model

var DHT11Schema = new mongoose.Schema({
    temperature: {type: String},
    humidity: {type: String},
    date: {type: Date, default: Date.now},
});

var DHT11 =mongoose.model("DHT11", DHT11Schema)

// API test

app.get("/test",function(request,response){
    console.log("Received 'test' request");
    response.status(200).json({"message":"success"});
});

// api luu du lieu

app.post("/dht11",function(request,response){
    console.log("Received 'create dht11 data' request");

    var newDHT11 = new DHT11({
        temperature: request.query.temperature,
        humidity: request.query.humidity
    });

    newDHT11.save().then(function(){
        
            console.log('saved new dht11 data');
    });
});

// api lay du lieu
app.get("/dht11",function(request,response){
    console.log("Received 'get dht11 data' request");

    DHT11.find().then(function(error,result){
        if(error){
            response.status(400).json({message: 'can not get data'});
        }
        else{
            response.status(200).json(result);

        }
    });
});

app.listen(SERVER_PORT,function(){
    console.log("server is listening on port:"+ SERVER_PORT);
});