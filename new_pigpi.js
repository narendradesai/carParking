'use strict';
const request = require('request');
var math = require('mathjs');
var Gpio = require('onoff').Gpio;    
var green_led = new Gpio(22, 'out');
var red_led = new Gpio(27, 'out');
const groundClearance = 24;
var previous=0;
var current=1;
var Gpio = require('pigpio').Gpio,
  trigger = new Gpio(17, {mode: Gpio.OUTPUT}),
  echo = new Gpio(18, {mode: Gpio.INPUT, alert: true});
var sensors={'sensor0':{'trigger':new Gpio(17, {mode: Gpio.OUTPUT}),'echo':new Gpio(18, {mode: Gpio.INPUT, alert: true}), 				 					'url':'http://54.89.16.117:80/slots/0'}
			}
// the REST api call code
var postData = { available: true};
var options = {};

green_led.writeSync(1);



// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6/34321;

sensors['sensor0']['trigger'].digitalWrite(0); // Make sure trigger is low
(function () {
	var startTick;
	var sensor = Object.keys(sensors);
	sensor.forEach(function(sensr) {
  	sensors[sensr]['echo'].on('alert', function (level, tick) {
    	var endTick,diff;

    	if (level == 1) {
      		startTick = tick;
    	} else {
      
	  		endTick = tick;
      		diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      
		 	var dist = (diff / 2 / MICROSECDONDS_PER_CM);
		 	dist = math.round(dist,0);

 			if( dist < groundClearance && dist >= 1){
				postData.available = false;
				console.log('Distance : '+dist);
				previous=current;
				current=0;
		} 

		else if (dist >= groundClearance && dist< 2800){
			
			postData.available = true;
			console.log('Distance : '+dist);
			previous=current;
			current=1;
		}
		
		if(previous!=current ){
 
			if(current==0){
				red_led.writeSync(1);
				green_led.writeSync(0);
			}
			if(current==1){
				red_led.writeSync(0);
				green_led.writeSync(1);
			}
			options = {
				url: sensors[sensr]['url'],
		  		method: 'post',
		  		body: postData,
		  		json: true
			}
			console.log(`Request sent`)
				//post request that will be sent by each sensor
			request(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//console.log(`Body: ${body}`)
				 } else {
				// console.log(`Error: ${error}`);
				 }
			});
		}

    };
  });
 });
}());

// Trigger a distance measurement once per second
setInterval(function () {
//console.log(sensors['sensor0']['trigger']);
	var sensor = Object.keys(sensors);
	sensor.forEach(function(sensr) {
		sensors[sensr]['trigger'].trigger(10, 1); // Set trigger high for 10 microseconds
	});
}, 700);

