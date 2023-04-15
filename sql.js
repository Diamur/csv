var mysql = require('mysql');

//---------------------------------------------------------------

var filename = "";
var filenameNew = "";
var NewContent = '';
var filecsv = '';
//---------------------------------------------------------------

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
//     if(index == 2)	  
//     filename = val;	
//     filecsv = val;	
//     filenameNew =filename.replace(".csv","_n.csv") ;
//   });  
//   if(filename== "") { 
//        console.log("filename не задано: формат ввода: <node sql filename >");
    
//---------------------------------------------------------------

var connection = mysql.createConnection({
    host     : 'vangre.beget.tech',
    user     : 'vangre_002',
    password : '&Hlz6m6m',
    database : 'vangre_002'
  });
  connection.connect();
   
  var sqlquery = "SELECT * from b_file WHERE `SUBDIR` = 'catalog_1_1' LIMIT 10";
  
  
  connection.query( sqlquery, function (error, results, fields) {
    if (error) throw error;
    // console.log('The results is: ', results);
    // console.log('The fields is: ', fields);
    console.log('The results is: ', results);
    console.log('The results is: ', results.length);
  });
   
  connection.end();
  return;