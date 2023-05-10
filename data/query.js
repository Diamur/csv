    module.exports = 
{
   isTable :        function(table_name){ 
                                    return `SHOW TABLES LIKE '${table_name}'`;
                                    },
   CreateNewTable : function(table_name){ 
return `CREATE TABLE ${table_name} 
( ID INT NOT NULL AUTO_INCREMENT , 
FILE_NAME VARCHAR(50) NOT NULL , 
SUBDIR VARCHAR(50) NOT NULL , 
NAME VARCHAR(50) NOT NULL , 
ORIGINAL_NAME VARCHAR(50) NOT NULL , 
b_file_ID INT NOT NULL , 
b_iblock_element_ID INT NOT NULL , 
PRIMARY KEY (ID), 
UNIQUE (FILE_NAME)) 
ENGINE = InnoDB;`;
},
     b_file:        function(iblock_id){ 
return `SELECT 
b_file.ID  AS b_file_ID ,
b_iblock_element.ID  AS b_iblock_element_ID ,
b_iblock_element.NAME  ,
b_iblock_element.DETAIL_PICTURE ,
b_file.SUBDIR ,
b_file.FILE_NAME ,
b_file.ORIGINAL_NAME  
FROM  b_iblock_element  
INNER JOIN  b_file  ON  b_file.ID  =  b_iblock_element.DETAIL_PICTURE 
WHERE  b_iblock_element.IBLOCK_ID  = ${iblock_id} 
GROUP BY  b_file.FILE_NAME`;
} ,
   
     insert:        function( table_name,FILE_NAME, SUBDIR, NAME,ORIGINAL_NAME,b_file_ID ,b_iblock_element_ID ){ 
return `INSERT INTO ${table_name} 
(FILE_NAME,SUBDIR,NAME,ORIGINAL_NAME,b_file_ID,b_iblock_element_ID) 
VALUES('${FILE_NAME}','${SUBDIR}','${NAME}','${ORIGINAL_NAME}',${b_file_ID},${b_iblock_element_ID})`;
} ,   
 isFILE_NAME:        function( table_name,FILE_NAME){ 
return `SELECT * FROM  ${table_name}  WHERE FILE_NAME = '${FILE_NAME}'`;
} ,
   
};