const Product=require('../model/productModel')

const addArraytodb= (data)=>{
    console.log(data);
    data.forEach(async i=>{
        const{id,sku,title,description,style,price,
        installments, currencyId,currencyFormat,isFreeShipping}=i;
        let availableSizes=i.availableSizes.replace(/\"/g,"").split(",");
        console.log(availableSizes,"size");
        const record=new Product({
            id,sku,title,description,availableSizes,style,price,
            installments, currencyId,currencyFormat,isFreeShipping,
        });
        console.log(record,"new product");
       try{ await record.save();}
       catch(err){console.log(err) }
        })
}
exports.addArraytodb=addArraytodb;

const addObjTodb=async (obj)=>{
    const product={...obj, 
        availableSizes:i.availableSizes.replace(/\"/g,"").split(",")
    }
    const newProduct=new Product(product);
    try{ await newProduct.save();
       // console.log(newProduct,"new product");
    }
    catch(err){console.log(err) }
     }
exports.addObjTodb=addObjTodb;