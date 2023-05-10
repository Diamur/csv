const mysql = require('mysql');
const fs  = require('fs');
const wget = require('node-wget');
const profile = require("./data/mysql_profile.js")  
const query = require("./data/query.js")  
//---------------------------------------------------------------
// var sqlquery = `SELECT 
// b_file.ID  AS b_file_ID ,
// b_iblock_element.ID  AS b_iblock_element_ID ,
// b_iblock_element.NAME  ,
// b_iblock_element.DETAIL_PICTURE ,
// b_file.SUBDIR ,
// b_file.FILE_NAME ,
// b_file.ORIGINAL_NAME  
// FROM  b_iblock_element  
// INNER JOIN  b_file  ON  b_file.ID  =  b_iblock_element.DETAIL_PICTURE 
// WHERE  b_iblock_element.IBLOCK_ID  =26 
// GROUP BY  b_file.FILE_NAME
// `;


const domen_name = "bericabel.ru";//.replace('.ru','');
const table_name = "upload_" + domen_name.replace('.ru',''); ;

const db_old    =  profile["vkcable_db7"];  
const db_new    =  profile["adminv50_centr"]; 

const query_b_file    = query.b_file(26);
const query_istable   = query.isTable(table_name);
const query_new_table = query.CreateNewTable(table_name);

// `INSERT INTO ${table_name} (FILE_NAME,SUBDIR,NAME,ORIGINAL_NAME,b_file_ID,b_iblock_element_ID) VALUES('${FILE_NAME}','${SUBDIR}','${NAME}','${ORIGINAL_NAME}','${b_file_ID}','${b_iblock_element_ID}',)`

// console.log('query_b_file: ' , query_b_file );

// const url = "https://"  + domen_name +"/upload/";
// const dir = "H:/!_wget/"+ domen_name +"/in/";

// console.log('profile db_old : ' , db_old );
// console.log('profile db_new : ' , db_new );
// console.log('query.data =  ' , query.isTable(table_name) );
// console.log('query.CreateNewTable =  ' , query.CreateNewTable(table_name) );

//-------------------------------FUNCTIONS -----------------
async function getQuery(db,query){
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection(db);
        connection.connect();
        connection.query( query, function (error, results, fields) {
            if (error) throw error;
            resolve(results);
        });    
        connection.end();
    })
}

async function CreateNewTable(){       
        var array = await getQuery(db_new , query_istable );
        console.log("array isTable : ", array );
        if(array[0]== undefined){            
            var array = await getQuery(db_new , query_new_table );
            // console.log("array CreateNewTable: ", query_new_table);       
            console.log("создали новую таблицу: ", table_name); 
            return true;
        }else{
            console.log("таблица уже существует: ", table_name); 
            return true;
        }       
}

async function run(){

    // Создание новой таблицы, если есть работаем дальшеж
    // CreateNewTable() ;
    
    
    // Получение результата
     var array = await getQuery(db_old , query_b_file );
    console.log("array.length = ", array.length);
 

var num = 0;
 //-------------- ЦИКЛ ----------------------------------------------------------
 for (const element of array) {
    var insert;
    const query_insert = query.insert(table_name,  element.FILE_NAME, element.SUBDIR, element.NAME , element.ORIGINAL_NAME, element.b_file_ID,  element.b_iblock_element_ID ) ;
    const query_isfile =  query.isFILE_NAME(table_name,element.FILE_NAME);
    const isFileName = await getQuery(db_new,query_isfile);          
    if(isFileName.length == 0)
              insert   = await getQuery(db_new, query_insert);
        //   console.log('insert: ' , insert );
        num++;
        if(num%100 == 0) console.log('num: ' , num );
    }
//-------------- КОНЕЦ ЦИКЛА ----------------------------------------------------------
  console.log('Done! pos -',num);

}

//-------------------------------РЕАЛИЗАЦИЯ -----------------
run();
  
return;

