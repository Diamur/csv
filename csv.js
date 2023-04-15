const fs  = require('fs');
const csv = require('csv-parser'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//---------------VAR----------------------------------------------------------------
var fileNameVPR = "";
var fileNameParse = "";
var fileNameOUT = "";
var map =  new Map();
var arrNewHeaders = [];
var arrHeaders = [];

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
//-------------- запись в map
//-------------------------------------------------------------------------------
async function setMap(filename,key){
    return new Promise((resolve, reject) => {
        
   
    var num = 0; 
    fs.createReadStream(filename,"utf-8") 
    .pipe(csv({ separator: ';' })) 
    .on('headers', (headers) => { 
        arrHeaders =   headers;
            console.log(`Headers:`, headers) ;
    })
    .on('data', (row) => { 
      num++;
      if(num < 3)
       console.log  ( row[key] ); 
    //  console.log  ( row.IE_ID , row.IE_NAME ); 
    //  console.log  (num, arrHeaders[0]+":"+row[arrHeaders[0]] , arrHeaders[1]+":"+row[arrHeaders[1]] ); 
    //---------------------------
    // ОБРАБОТКА СТРОК 
    //---------------------------
    // Запись в map

     const obj = {};
     arrHeaders.forEach(h=>{
        obj[h] = row[h];
     })
    //  obj[arrHeaders[0]] =  row[arrHeaders[0]];

    //  map.set(row[arrHeaders[0]],
     map.set(row[key],
     obj
        // {
        // Name:row[arrHeaders[0]],
        // NameID:row[arrHeaders[1]]
        // }
        )
}) 
.on('end', () => { 
    console.log('CSV file successfully processed'); 
    console.log(num);    
    console.log(map.get(`Автоматический выключатель DPX3 250 - термомагнитный расцепитель 25 кА 400 В  3П 200 А | 420208 Legrand`));    
    console.log(map.get(`ВБШвнг(А)-FRLSLTx 4х240`));    
   
    resolve(true);

    }); 

 })  
};
//-------------------------------------------------------------------------------
//-------------- ЧТЕНИЕ ИЗ CSV
//-------------------------------------------------------------------------------
function readFileCSV(filename){
    var num = 0; 
    fs.createReadStream(filename,"utf-8") 
    .pipe(csv({ separator: ';' })) 
    .on('headers', (headers) => {   
            console.log(`Headers:`, headers) ;
        // Назначение/преобразования новых заголовков для нового файла
        headers.forEach((s,i)=>{
            if(i==5){
                arrNewHeaders.push({id:s,title:s});
                arrNewHeaders.push({id:'name_id',title:'name_id'});
            }else{
                arrNewHeaders.push({id:s,title:s});
            }
        })
    })
    .on('data', (row) => { 
      num++;
      if(num <100)
     console.log  ( row ); 
    //  console.log  ( row.IE_ID , row.IE_NAME ); 
    //---------------------------
    // ОБРАБОТКА СТРОК 
    //---------------------------
    // Запись в map

}) 
.on('end', () => { 
    console.log('CSV file successfully processed'); 
    console.log(arrNewHeaders);
    console.log(num);    
    }); 
};

//-------------------------------------------------------------------------------
//-------------- ЗАПИСЬ В CSV
//-------------------------------------------------------------------------------
function writeFileCSV(filename){
    const csvWriter = createCsvWriter({
        path: filename,
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

async function start(){

     // Проверка входных данных
if(!isInputVal()) return;

// Прочитать NAME ID csv
// readFileCSV(fileNameParse);
await setMap( fileNameVPR,"IE_NAME");
await setMap( fileNameParse,"name");

// Записать данные в MAP по ключу НАИМЕНОВАНИЯ

// Прочитать 01_01
// Добавить поле ID после NAME
// ЗАПИСАТЬ

//writeCSV();
// console.log(map);

};
//-------------------------------------------------------------------------------
//-------------- РЕАЛИЗАЦИЯ 
//-------------------------------------------------------------------------------

start();