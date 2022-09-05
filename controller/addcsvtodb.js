const Product=require('../model/productModel')

const objArraytodb= (data)=>{
    //console.log(data);
    data.forEach(async i=>{
        const{pid,sku,title,description,style,price,size,
        installments, currencyId,currencyFormat,isFreeShipping,availableSizes}=i;
        //let available=toString(availableSizes).replace(/\"/g,"").split(",");
        //console.log(available,"size");
        const record=new Product({ 
            pid,sku,title,description,availableSizes,style,price,size,
            installments, currencyId,currencyFormat,isFreeShipping,
        });
        //console.log(record,"new product");
       try{ await record.save();}
       catch(err){console.log(err) }
        })
}
exports.objArraytodb=objArraytodb;
/**turn obj file to mongoDB ?  */
const addObjTodb=async (obj)=>{
    const product={...obj, 
        availableSizes:obj.availableSizes.replace(/\"/g,"").split(",")
    }
    const newProduct=new Product(product);
    try{ await newProduct.save();
       // console.log(newProduct,"new product");
    }
    catch(err){console.log(err) }
     }
exports.addObjTodb=addObjTodb;