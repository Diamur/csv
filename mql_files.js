const fs = require('fs');
// const fn = require("./function.js");

// node mql_files.js <dirProject> <nameProject>
// node mql_files.js <dirProject> <nameProject>

var dirProject = "";
var nameProject = "";
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if(index == 2)	  
     dirProject = val;	
     
  if(index == 3)	  
     nameProject = val;	
});

if(dirProject== "") { 
     console.log("dirProject не задано: формат ввода: <node namefile dirProject >");
     return;
}else{
  nameProject = dirProject.split('\\')[dirProject.split('\\').length-1] == ""? dirProject.split('\\')[dirProject.split('\\').length-2]: dirProject.split('\\')[dirProject.split('\\').length-1];
 }

 
//  var dir = `c:\\Users\\Дима\\AppData\\Roaming\\MetaQuotes\\Terminal\\36A64B8C79A6163D85E6173B54096685\\MQL5\\Experts\\${nameProject}\\`;
var dir = dirProject;
var file = nameProject+'.mq5'; 
var filePath = dir + file;
console.log('filePath = ',filePath);
//  return;
var filePathCopy = dir  + "_A_" + file;
var str  = ""; 
var res = '';
var level = 0;
var countInclude = 0;
var exemption = 0;
var inclusion = 0;
var content = ''; 
//--------------------------------------------
function getSubFilePath(dir, path){
  arrpath = path.split('\\');
          var fname ='';
          var subdir = '' 
        arrpath.forEach(el => {
          if(el.length != 0)
          if(el.indexOf('.mqh') != -1 ){
            fname = el;
          }else{
            subdir = el+'\\';
          }
        });
        return {dir:dir + subdir, filename:fname } ;
}

//--------------------------------------------
 function getContent(dir,filename){
  level++;
  const _in = level;
  // console.log('_in: ' , _in );
  // console.log('level: ' , level );
 
  var txt = fs.readFileSync( dir + filename , {encoding:'utf16le', flag:'r'} );
  var arr  = txt.split('\r\n'); 
  countInclude++;
  // console.log('txt: ' , txt );
//--------------------------------------------
//      Обработка строк
//--------------------------------------------
  arr.forEach( s =>{   

    // const s0 =  s.indexOf('property link') == -1 &&  filename != "open_values.mqh" ? s.split('//')[0] : s ;
    const s0 =  s.indexOf('property link') == -1 &&  filename != "open_values.mqh" ? s.indexOf('property link') == -1 &&  filename != "close_values.mqh" ? s.split('//')[0] : s : s;
    // const s0 =  s.indexOf('property link') == -1 &&  filename != "close_values.mqh" ? s.split('//')[0] : s ;
    // const s0 =  s.indexOf('property link') == -1 && filename != "public.mqh" ? s.split('//')[0] : s ;
    // const s0 =  s.indexOf('property link') == -1 || filename != "public.mqh" ? s.split('//')[0] : s ;
    // const s0 =  s.indexOf('property link') == -1 && ( filename != "open_values.mqh"  || filename != "close_values.mqh")   ? s.split('//')[0] : s ;
    // const s0 =  filename != "open_values.mqh" ? s.split('//')[0] : s ;
    // const s0 =  filename != "close_values.mqh" ? s.split('//')[0] : s ;
//--------------------------------------------
//      Подключение других файлов
//--------------------------------------------
// if(countInclude <2 )

  if( s0.length != 0  &&
      s0.indexOf('#include') != -1 &&
      s0.indexOf('"') != -1  &&
      s0.indexOf('Trade\PositionInfo.mqh') == -1  &&
      s0.indexOf('Trade\Trade.mqh') == -1 &&
      s0.indexOf('Trade\SymbolInfo.mqh') == -1 && 
      s0.indexOf('\\setting\\FilePathMain.mqh') == -1 && 
      s0.indexOf('class\\JAson.mqh') == -1 && 
      s0.indexOf(`..\\${nameProject}.mq5`) == -1  
    )  {
    const start = s0.indexOf('"');
    const stop  = s0.indexOf('"',start+1);
    const path  = s0.substring(start+1,stop);
    const sub = getSubFilePath(dir,path) ;
    content = getContent(sub.dir,sub.filename);      
  }
  //--------------------------------------------
  //          ВКЛЮЧАЕМ СТРОКИ КОДА
  //--------------------------------------------
  else  
  if( s0.indexOf('\\setting\\FilePathMain.mqh') == -1 
     && s0.indexOf(`..\\${nameProject}.mq5`) == -1 
     && s0.replace(/\s/g,"") != "" 
     ){
  inclusion++;
console.log(countInclude, inclusion, 's0: ВКЛЮЧАЕМ В', filename ,'-', s0 );
    // return;
    content += s0  + '\n'; ;
    //  console.log("s0.length = ", s0.replace(/\s/g,"") == "", s0.length , s0);
  }
  
  //--------------------------------------------
  //           Не вошедшие строки в код
  //--------------------------------------------
  else{
    exemption++;
    //  console.log(exemption, 's0: ИСКЛЮЧАЕМ В', filename ,'-', s0 );
  } 
})  
//  console.log('_out: ' , _in );

//  console.log('content: ' , content );
  return content; 
   }
//--------------------------------------------
var t =  getContent(dir,file) ;
// console.log(t);
// console.log(t.split('\n').length);
const utf16buffer = Buffer.from(`\ufeff${t}`, 'utf16le');
fs.writeFileSync(filePathCopy,utf16buffer,{encoding:"utf16le"}); 