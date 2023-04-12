const fs  = require('fs');

var dir = "";

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if(index == 2)	  
  dir = val;	
});

if(filename== "") { 
     console.log("filename не задано: формат ввода: <node index filename >");
     return;
}