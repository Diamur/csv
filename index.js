const fs  = require('fs');
var mysql = require('mysql');
const csv = require('csv-parser'); 
// const csv2 = require('fast-csv');
// const CsvReadableStream = require('csv-reader');
// const csv = require('csv')
//--------------------------------------

var filename = "";
var filenameNew = "";
var NewContent = '';
var filecsv = '';

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if(index == 2)	  
  filename = val;	
  filecsv = val;	
  filenameNew =filename.replace(".csv","_n.csv") ;
});

if(filename== "") { 
     console.log("filename не задано: формат ввода: <node index filename >");
     return;
}


// var txt = fs.readFileSync( filecsv , {encoding:'utf8', flag:'r'} );
// var arr  = txt.split('\r\n'); 
// console.log(arr);
var num = 0; 
fs.createReadStream(filecsv,"utf-8") 
.pipe(csv({ separator: ';' })) 
.on('headers', (headers) => {   console.log(`Headers:`, headers) })
.on('data', (row) => { 
  num++;
  if(num <100)
 console.log  ( row.IE_ID , row.IE_NAME ); 
 
// console.log  ( row); 
}) 
.on('end', () => { 
console.log('CSV file successfully processed'); 
}); 

// let inputStream = fs.createReadStream(filecsv, 'utf8');

// inputStream
// 	.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
// 	.on('data', function (row) {
// 	    // console.log('A row arrived: ', row);
// 	}).on('end', function () {
// 	    // console.log('No more rows!');
// 	});


return;







var connection = mysql.createConnection({
  host     : 'vangre.beget.tech',
  user     : 'vangre_002',
  password : '&Hlz6m6m',
  database : 'vangre_002'
});
connection.connect();
 
var sqlquery = "SELECT * from b_file WHERE `SUBDIR` = 'catalog_1_1'";


connection.query( sqlquery, function (error, results, fields) {
  if (error) throw error;
  // console.log('The results is: ', results);
  // console.log('The fields is: ', fields);
  console.log('The results is: ', results.length);
});
 
connection.end();
return;





 function getContent(filename){

    var txt = fs.readFileSync( filename , {encoding:'utf8', flag:'r'} );
    var arr  = txt.split('\r\n'); 
    // console.log(arr);
    var num = 0;
    var rezult = "";

    arr.forEach(str => {
        num++;

        if(str.indexOf("youtube") != -1){

        }else{
            str.replace("~"," ");
            str.replace("Null","");

           rezult += str + '\n';
        }
        console.log(num, str);
        
    });

    return rezult;
 }

//  getContent(filename);

 //console.log( getContent(filename));
 NewContent =  getContent(filename) ;
console.log(NewContent);

 fs.writeFileSync(filenameNew,NewContent,{encoding:"utf8"}); 

