 $(document).ready(function(){
                var sensors = [0,1,2];
                
                function glowbulb(){
                    $("#logo").fadeOut(function(){
                        $("#logo").attr("src", "images/logo3_glow.png");
                        $("#logo").fadeIn(2000,glowbulb);    
                    });
                }
                glowbulb();
             
                
                var socket = io();
                var prevState = [
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
                socket.on('statusChange', function(sensors) {
                     for(sensor in sensors){
                            var i=sensor;
                            
                            i++; 
                            if(sensors[sensor].available){
                                 $("#slot"+i).fadeOut(700);
                             }
                             else {
                                $("#slot"+i).fadeIn(1000);
                             }
                         
                      
                    }
                   
                });
                });
                                
                                             
                

                