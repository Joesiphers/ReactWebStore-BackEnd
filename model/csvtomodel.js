const addtodb=require('../controller/addcsvtodb');
const path=require('path');
const fastcsv=require('fast-csv');
const csv=require('csvtojson');
const fs =require('fs');
/**turn a json file to CSV file and send back to client
 * later can be use to accept json api
  */

const productModel=require('./productModel')
const list=require('./products.json');
let products= list.products;//get the product array

const get=(req,res)=>{
    /**convert json to csv */
    var fields=Object.keys(productModel.schema.obj);//retriev the mongoose model's keys
    console.log (fields);
    //create parser and data format as field==>unwind not necessory,unwind:["id","sku"]}.
    const {Parser} = require('json2csv');
    const csvParser = new Parser();
    let csv = csvParser.parse(products);
    console.log("csv ready",csv);
/*     res.set("Content-Disposition","attachment;filename=products.csv");
    res.set("Content-Type","application/octet-stream");
    res.send(csv); */
    res.status(200 ).json("get the file");
}
exports.get=get;
const fastcsvTo= (csvfile,res)=>{
    console.log("read the file");
    fs.createReadStream(csvfile)
        .pipe(fastcsv.parse({headers: true}))//true
        //.on("headers",h=>{header=h})
        .on("data", row=>{addtodb.addObjTodb(row);console.log(row)})
/*rows.push(r);fastcsv {id: '9',sku: '11600983276356164',  title: 'Crazy Monkey Grey',...,  isFreeShipping: 'true' }*/
    .on("end",(rowCount,number)=>{
/*         console.log("header", header,"header");
        console.log("rows", rows,"rowEnd"); */
        console.log(`Parsed ${rowCount} rows`)
    });

/* path.resolve(__dirname,csvfile)    
    }) */
};
exports.fastcsvTo=fastcsvTo;

const csvjson= (csvfile)=>{
    console.log("read the file");
    /*use csvtojson transfer csv file to a array contain json record */
/*csvtojson [ { id: '12',sku: '12064273040195392', ..., isFreeShipping: 'true' },...]*/

    csv().fromFile(csvfile).then(
        json=>{
            addtodb.addArraytodb(json)
            
            });
/*csvtojson [ { id: '12',sku: '12064273040195392', ..., isFreeShipping: 'true' },...]*/
}
exports.csvjson=csvjson;



/*var fields=[]*/