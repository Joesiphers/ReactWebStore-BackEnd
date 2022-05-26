const productModel=require('./productModel')
const list=require('./products.json');
let products= list.products;
const get=(req,res)=>{
    var fields=Object.keys(productModel.schema.obj);//retriev the model's keys
    console.log (fields);
    //create parser and data format as field==>unwind not necessory,unwind:["id","sku"]}.
    const {Parser} = require('json2csv');
    const csvParser = new Parser();
    let csv = csvParser.parse(products);
    console.log("csv ready",csv);
    res.set("Content-Disposition","attachment;filename=products.csv");
    res.set("Content-Type","application/octet-stream");
    res.send(csv);

}
exports.get=get;
/*var fields=[]*/