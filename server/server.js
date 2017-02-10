const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


app.use(bodyParser.json());

//readings from sensors , will be received from RasberryPi
var sensors =[ 
    {
        "available": true,
        "flag":0
    },
     {
        "available": true, 
         "flag":0
    },
     {
        "available": true,
         "flag":0
    }
             ];

//get status of all slots
app.get('/slots', (request, response) => {
   console.log('Getting status of all slots');
   response.send({
       "slots": sensors
   });
});

//get status of specific slot
app.get('/slots/:id', (request, response) => {
   var id = request.params.id;
   console.log('Getting satus of spot ', id);
    response.send(sensors[id]);
  /* if(!sensors[id].available){ //if parking not available
       return response.send({"status": "Spot taken"});
   }
    response.send({"status": "Spot Avaialble"}); */
});

//set status of specific slot
app.post('/slots/:id', (request, response) => {
   var id = request.params.id;
   console.log('Setting the status of spot', id);
    sensors[id].available = request.body.available;
    response.send();
    io.sockets.emit('statusChange', sensors);

});

//post status of all slots
app.post('/slots', (request, response) => {
    sensors = request.body.sensors;
    console.log(sensors);
    response.send();
});


io.on('connection', (socket) => {
	console.log('New User connected');
    socket.emit('firstLoad', sensors);
    });

server.listen(port, () => {
	console.log(`server is up on port: ${port}`);
});
