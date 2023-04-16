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
var arrUrls = [];

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
//-------------- Прочитать и занести в массив список файлов csv
//-------------------------------------------------------------------------------

function getArrStrFromFile(filename){
    var txt = fs.readFileSync( filename , {encoding:'utf8', flag:'r'} );
    return txt.split('\r\n');
 }

//-------------------------------------------------------------------------------
//-------------- запись в map
//-------------------------------------------------------------------------------

async function setMap(filename,key, catalog){
    return new Promise((resolve, reject) => {
    var num = 0; 
    fs.createReadStream(filename,"utf-8") 
    .pipe(csv({ separator: ';' })) 
    .on('headers', (headers) => { 
        arrHeaders =   headers;
            console.log(`Headers:`, headers) ;
    })
    .on('data', (row) => { 
    
      if(num < 3)
    //    console.log  ( row[key] ); 
       console.log(' row.pic1: ' ,  row.pic1 );
    //  console.log  ( row.IE_ID , row.IE_NAME ); 
    //---------------------------
    // ОБРАБОТКА СТРОК 
    //---------------------------
    // Запись в map

     var obj = {};
    // Если НЕ fileNameVPR 
     if(filename.indexOf('ID') == -1){
        obj = map.get( row.name) ;
        if(num < 3){
            console.log('map.get( row.name): ' , map.get( row.name) );
            console.log('obj: ' , obj );
        }
     }
    // Добавляем значения КОЛОНОК
    arrHeaders.forEach(h=>{
    //Если нашлось в ВПР позиция  
    if(obj) {
    //Добавляем ПОЛЯ
        if(h=='cat5'){
            obj[h] = row[h];   
            obj['SUBDIR'] = catalog;   
        }
        if(h=='pic1'){
            obj[h] = row[h];   
            obj['pic'] = 'vk_' + row[h].replace('1000x1000w','400x200').replace('https://e-kc.ru/files/products/','');   
            //.jpg  image/jpeg
            //.jpeg image/jpeg
            //.png  image/png
            //.gif  image/gif
            obj['CONTENT_TYPE'] =  obj['pic'].indexOf('.jpg') != -1 ? 'image/jpeg' :  
                                    ( obj['pic'].indexOf('.jpeg') != -1  ? 'image/jpeg' :  
                                       ( obj['pic'].indexOf('.png') != -1 ? 'image/png' : 
                                          (obj['pic'].indexOf('.gif') != -1 ? 'image/gif' : 'image/jpeg')  )  )  ; 

            obj['PATH'] = '/upload/' + catalog + '/' + obj['pic'];   
        }
        if(h=='price'){
            obj[h] = row[h];   
            obj['count'] = 100;   
        }
        else{
            obj[h] = row[h];   
            }
        }  
    })

   if(obj){
        if(num == 0){
          arrNewHeaders = Object.keys(obj);
          console.log('arrNewHeaders: ' , arrNewHeaders );
        }
        map.set(row[key], obj );
    }   
    num++;
}) 
.on('end', () => { 
    console.log('catalog: ' , catalog );
    console.log('CSV '+ filename +' file successfully processed'); 
    console.log(num);    
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
async function writeFileCSV(filename){


    arrNewHeaders.forEach(h=>{

        

    })

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

//-------------------------------------------------------------------------------
//-------------- START
//-------------------------------------------------------------------------------
async function start(){
// Проверка входных данных
if(!isInputVal()) return;

// Прочитать NAME ID csv
await setMap( fileNameVPR,"IE_NAME");

arrUrls = getArrStrFromFile('data/urls.txt');
    for (const file of arrUrls) {
    // Записать данные в MAP по ключу НАИМЕНОВАНИЯ
      await setMap( file.split(',')[0],"name",file.split(',')[1].replaceAll(' ',''));
    }

    console.log(map.get(`Автоматический выключатель DPX3 250 - термомагнитный расцепитель 25 кА 400 В  3П 200 А | 420208 Legrand`));    
    console.log('Done!');

// Прочитать 01_01
// Добавить поле ID после NAME
// ЗАПИСАТЬ

  map.forEach((value, key, map) => {
    // Prints "greeting Hello" followed by "name John"
    // console.log(value, key);
  });


};

//-------------------------------------------------------------------------------
//-------------- РЕАЛИЗАЦИЯ 
//-------------------------------------------------------------------------------

start();