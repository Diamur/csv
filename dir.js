//---------modules---------
const fs  = require('fs');
//----------var------------
var dir = "";
var map =  new Map();
//----------Functions----------------

function viewDirectores1(dir){
 // Open the directory
let openedDir = fs.opendirSync(dir);

console.log("\n-----------------", openedDir.path);
console.log("\nДиректория :");

let filesLeft = true;

while (filesLeft) {
    // Перебор папок и файлов по одному
    let fileDirent = openedDir.readSync();
    
    // если папка не пустая
    if (fileDirent != null){
         // если объект - ПАПКА
         if( fileDirent.isDirectory()){
             console.log("Dir:", fileDirent.name);
             console.log("DirChild:", dir + "/"+ fileDirent.name );
             try {
                 viewDirectores1( dir + "/"+ fileDirent.name);               
             } catch(error) {
                console.log("Ошибка:", dir + "/"+ fileDirent.name);
             }
            }            
        // если объект - Файл
        if( fileDirent.isFile()){
            map.set(fileDirent.name,dir)
            console.log("File:", fileDirent.name);
        }
    }    
    // конец перебора
    else filesLeft = false;
   
  }
};

function viewDirectores2(dir){
    fs.readdir(dir, { withFileTypes: true }, (error, files) => {
        if (error) throw error;
  
   console.log("-----------СПИСОК ПАПОК-----------");
      const directoriesInDIrectory = files
          .filter((item) => item.isDirectory())
          .map((item) => item.name);
          
          console.log(directoriesInDIrectory);
          console.log("------СПИСОК ФАЙЛОВ----------------");
  
      const FilesiesInDIrectory = files
      .filter((item) => item.isFile())
      .map((item) => item.name);
  
      console.log(FilesiesInDIrectory);
  });
 }; 

// ---------BODY----------

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if(index == 2)	  
  dir = val;	
});
if(dir== "") { 
     console.log("dir не задано: формат ввода: <node dir dir >");
     return;
}

//--------------------------------------------------------------------------------------
// 1 ВАРИАНТ - ПЕРЕБОР ПАПОК И ФАЙЛОВ
//--------------------------------------------------------------------------------------

// viewDirectores1(dir);
viewDirectores1( dir );
console.log(map);
//--------------------------------------------------------------------------------------
// 2 ВАРИАНТ - СПИСОК ПАПОК И ФАЙЛОВ
//--------------------------------------------------------------------------------------
// iewDirectores2(dir);