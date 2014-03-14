// Failsafe for IE
if (typeof(console) == "undefined") { console = {}; } 
if (typeof(console.log) == "undefined") { console.log = function() { return 0; } }    
