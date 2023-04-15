const fs  = require('fs');
const csv = require('csv-parser'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//---------------VAR----------------------------------------------------------------
var fileNameVPR = "";
var fileNameParse = "";
var fileNameOUT = "";
var map =  new Map();

//---------------FUN--------------------------------------------------------------
//-------------- ПРОВЕРКА ВХОДНЫХ ДАННЫХ
function isInputVal(){
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
        if(index == 2)   fileNameVPR = val;	
        if(index == 3)   fileNameParse = val;		
      });
      
      if(fileNameVPR== "") { 
            console.log("filename не задано: формат ввода: <node csv fileNameVPR fileNameParse  >");
           return false;
      }
      else if(fileNameParse== "")  {
            console.log("filename не задано: формат ввода: <node csv fileNameVPR fileNameParse  >");
        return false;
      } else {
            fileNameOUT =fileNameParse.replace(".csv","_id.csv") ;
      }
      return true;
};
//-------------------------------------------------------------------------------
//-------------- ЧТЕНИЕ ИЗ CSV
//-------------------------------------------------------------------------------
function readFileCSV(filename){
    var num = 0; 
    fs.createReadStream(filename,"utf-8") 
    .pipe(csv({ separator: ';' })) 
    .on('headers', (headers) => {   console.log(`Headers:`, headers) })
    .on('data', (row) => { 
      num++;
      if(num <100)
     console.log  ( row ); 
    //  console.log  ( row.IE_ID , row.IE_NAME ); 
    }) 
    .on('end', () => { 
    console.log('CSV file successfully processed'); 
    }); 
};

//-------------------------------------------------------------------------------
//-------------- ЗАПИСЬ В CSV
//-------------------------------------------------------------------------------
function writeFileCSV(){
    const csvWriter = createCsvWriter({
        path: 'file.csv',
        header: [
            {id: 'name', title: 'NAME'},
            {id: 'lang', title: 'LANGUAGE'}
        ]
    });
     
    const arrRecords = [];
    const object     = {};
    
    arrRecords.push(object["name"]='Bob');
    arrRecords.push(object["name"]='Bob');
    
    const records1 = [
        {name: 'Bob',  lang: 'French, English'},
        {name: 'Mary', lang: 'English'}
    ];
    
    // csvWriter.writeRecords(records)       // returns a promise
    //     .then(() => {
    //         console.log('...Done');
    //     });
    
    async function writeCSV(){
        await csvWriter.writeRecords(records1);
        await csvWriter.writeRecords(records1);
     
     ;
    };  
};

//-------------------------------------------------------------------------------
//-------------- РЕАЛИЗАЦИЯ 
//-------------------------------------------------------------------------------
//-1
//-2
// Проверка входных данных
if(!isInputVal()) return;

// Прочитать NAME ID csv
readFileCSV(fileNameParse);

// Записать данные в MAP по ключу НАИМЕНОВАНИЯ

// Прочитать 01_01
// Добавить поле ID после NAME
// ЗАПИСАТЬ

//writeCSV();