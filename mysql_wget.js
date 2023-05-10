const mysql = require('mysql');
const fs  = require('fs');
const wget = require('node-wget');
const profile = require("./data/mysql_profile.js")  
const query = require("./data/query.js")  
//---------------------------------------------------------------
const domen     = "allcabletorg.ru";
const upload    = "https://" + domen +"/upload/";
const dir0      = "H:/!_wget/" + domen ;
const dir1      = "H:/!_wget/" + domen +"/in/";
const dir2      = "H:/!_wget/" + domen +"/in/iblock";
const dir       = "H:/!_wget/" + domen +"/in/";
const db_data   =  profile[domen];
const query_b_file = query.b_file(26);

//-------------------------------FUNCTIONS -----------------
async function getQuery(query){
return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(db_data);
    connection.connect();
    connection.query( query, function (error, results, fields) {
    if (error) throw error;
       resolve(results);
    });    
    connection.end();
  })
}

async function getWget(url,dist){
return new Promise((resolve, reject) => {
    wget({
        url:  url,
        dest: dist,      // destination path or path with filenname, default is ./
        timeout: 4000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
    },
    function (error, response, body) {
            if (error) {
                console.log('--- error:');
                console.log(error);            // error encountered
                reject(false)
            } else {
                console.log('--- headers:');
                console.log(response.headers); // response headers
            // console.log('--- body:');
            // console.log(body);             // content of package
            resolve(true);
            }
        }
    );
  })
}

async function run(){
// console.log('db_data: ' , db_data );
// console.log('query_b_file: ' , query_b_file );
// Создаем папки
if (!fs.existsSync(dir0)) fs.mkdirSync(dir0);
if (!fs.existsSync(dir1)) fs.mkdirSync(dir1);
if (!fs.existsSync(dir2)) fs.mkdirSync(dir2);
// Получение результата
 var array = await getQuery(query_b_file );
 console.log(array);

 for (const element of array) {
    const dist = dir + element.SUBDIR + '/';
    const url = upload + element.SUBDIR + '/' + element.FILE_NAME ;
    //Проверки существовании папки, если нет создаем
    if (!fs.existsSync(dist)){
            console.log( dist , " не существует...создаем" );
        fs.mkdirSync(dist);
    }else{
            console.log( dist , " существует" );
    }
    await getWget(url,dist);
  }
  console.log('Done!');
}
//-------------------------------РЕАЛИЗАЦИЯ -----------------
run();
  
return;

