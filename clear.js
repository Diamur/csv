const fs  = require('fs');
//--------------------------------------

var filename = "";
var filenameNew = "";
var NewContent = '';

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if(index == 2)	  
  filename = val;	
  filecsv = val;	
  filenameNew =filename.replace(".csv","_n.csv") ;
});

if(filename== "") { 
     console.log("filename не задано: формат ввода: <node clear filename>");
     return;
}

 function getContent(filename){

    var txt = fs.readFileSync( filename , {encoding:'utf8', flag:'r'} );
    var arr  = txt.split('\r\n'); 
    // console.log(arr);
    var num = 0;
    var rezult = "";

    arr.forEach(str => {
        num++;
        if(str.indexOf("youtube") == -1)
          {
            str = str.replace("~"," ");
            str = str.replace("Null","");
            rezult += str + '\n';
        }
        if(num < 10){
           console.log(num, str);
        }
    });
    return rezult;
 }

 NewContent =  getContent(filename) ;
console.log(NewContent.length);

 fs.writeFileSync(filenameNew,NewContent,{encoding:"utf8"}); 

