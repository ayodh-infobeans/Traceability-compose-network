/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class ProductContract extends Contract {
    async InitProducts(ctx) {

        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to initialize products`);
        }
    

        const products = [
            {
                orgMSP:mspid,
                productId : "prod1",
                manufacturerId: "Man1",
                productBatchNo: 2,
                productBatchManufacturingDate: "2023-04-25",
                productBatchExpiryDate: "2023-07-28",
                rawMaterialIds: ["raw1", "raw2"],
                productName: "chips",
                productDescription: "chips",
                productCategory: "Food",
                productManufacturingLocation: "Indore",
                productQuantity: "50",
                productManufacturingPrice: "1000",
                productManufacturingDate: "2023-04-25",
                productExpiryDate: "2023-08-22",
                productIngredients: "awaited Data",
                productTemprature:"27",
                type: "product",
                productSKU: "uniqueXYZ",
                productGTIN: "GTINXYZ",
                productImage: "chips" 
            },
        ];

        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState("prod_"+product.productId, Buffer.from(stringify(sortKeysRecursive(product))));
            console.info(`Product ${product.productId} initialized`);
        }
    }

    // CreateProduct issues a new product to the world state with given details.
    async CreateProduct(ctx, productId,rawMaterialIds, productName, productDescription, productCategory, productManufacturingLocation, productQuantity, productManufacturingPrice, productManufacturingDate, productExpiryDate, productIngredients,productTemprature, productSKU, productGTIN, productImage) {
        // Only Manufacturer Organization can create new product
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to create product`);
        }
        // check for already existing products
        const exists = await this.ProductExists(ctx, productId);
        if (exists) {
            throw new Error(`This product ${productId} already exists`);
        }

        // for (const rawMaterialId of rawMaterialIds) {
            
        //     const exists = await this.RawMaterialExists(ctx, rawMaterialId);
        //     if (!exists) {
        //         throw new Error(`This Raw Material ${rawId} not exists in the network`);
        //     }
            
        //     rawMaterial.docType = 'rawMaterial';
        //     // example of how to write to world state deterministically
        //     // use convetion of alphabetic order
        //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        //     // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
        //     await ctx.stub.putState("RM"+rawMaterial.rawID, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
        //     console.info(`RawMaterial ${rawMaterial.rawID} initialized`);
        // }
        
        const product = {
            orgMSP:mspid,
            productId : productId,
            manufacturerId: ctx.clientIdentity.getID(),
            rawMaterialIds: rawMaterialIds,
            productName: productName,
            productDescription: productDescription,
            productCategory: productCategory,
            productManufacturingLocation: productManufacturingLocation,
            productQuantity: productQuantity,
            productManufacturingPrice: productManufacturingPrice,
            productManufacturingDate: productManufacturingDate,
            productExpiryDate: productExpiryDate,
            productIngredients: productIngredients,
            productTemprature:productTemprature,
            type: "product",
            productSKU: productSKU,
            productGTIN: productGTIN,
            productImage: productImage
        };
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result = await ctx.stub.putState("prod_"+productId, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(result);
    }

    async UpdateProduct(ctx, productId,rawMaterialIds, productName, productDescription, productCategory, productManufacturingLocation, productQuantity, productManufacturingPrice, productManufacturingDate,productExpiryDate, productIngredients,productTemprature, productSKU, productGTIN,productImage){
        // Only Manufacturer Organization can update product
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to update product`);
        }

        const exists = await this.ProductExists(ctx, productId);
        if (!exists) {
            throw new Error(`This product ${productId} does not exist`);
        }
        
        const updateProduct = {
            orgMSP:mspid,
            productId : productId,
            manufacturerId: ctx.clientIdentity.getID(),
            rawMaterialIds: rawMaterialIds,
            productName: productName,
            productDescription: productDescription,
            productCategory: productCategory,
            productManufacturingLocation: productManufacturingLocation,
            productQuantity: productQuantity,
            productManufacturingPrice: productManufacturingPrice,
            productManufacturingDate: productManufacturingDate,
            productExpiryDate: productExpiryDate,
            productIngredients: productIngredients,
            productTemprature:productTemprature,
            type: "product",
            productSKU: productSKU,
            productGTIN: productGTIN,
            productImage: productImage
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result = ctx.stub.putState("prod_"+productId, Buffer.from(stringify(sortKeysRecursive(updateProduct))));
        return JSON.stringify(result);
    }

    // GetProductById returns the product stored in the world state with given id.
    async GetProductById(ctx, productId) {
        const productJSON = await ctx.stub.getState("prod_"+productId); // get the product from chaincode state
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${productId} does not exist`);
        }
        return productJSON.toString();
    }

    // DeleteProduct deletes a given product from the world state.
    async DeleteProduct(ctx, productId) {
        
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to delete product`);
        }
        
        const exists = await this.ProductExists(ctx, productId);
        if (!exists) {
            throw new Error(`The product ${productId} does not exist`);
        }
        return ctx.stub.deleteState("prod_"+productId);
    }

    // RawMaterialExists returns true when raw material with given ID exists in world state.
    async ProductExists(ctx, productId) {
        const productJSON = await ctx.stub.getState("prod_"+productId);
        return productJSON && productJSON.length > 0;
    }    

    // GetAllProducts returns all products found in the world state.
    async GetAllProducts(ctx) {
        const query = {
            "selector":{
                "type": "product"
            }
          };
          const queryResults = await ctx.stub.getQueryResult(JSON.stringify(query));
        
          const products = [];
          while (true) {
            const res = await queryResults.next();
            if (res.value) {
              const product = JSON.parse(res.value.value.toString('utf8'));
              products.push(product);
            } else {
              await queryResults.close();
              return JSON.stringify(products);
            }
          }
    }

   
}
module.exports = ProductContract;


// async checkProductAvailability(ctx, searchProduct, productQuantity) {
//     const allProducts = await this.GetAllProducts(ctx);
//     const data = JSON.parse(allProducts);
//     const result = data.filter((item)=> item.productName === searchProduct);
//     if(result.length !== 0){
//         if(productQuantity <= result[0].productQuantity){
//             return "Product is available in required quantity : "+ JSON.stringify(result);
//         }
//         else{
//             return "Product is not available in required quantity";
//         }
//     }
//     else{
//         return "Product is not available"; 
//     }
// }