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
        if (mspid !== 'ManufacturerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to initialize products`);
        }

        const products = [
            {
                productId : "prod1",
                manufacturerId: "Man1",
                productBatchNo: 2,
                // productBatchManufacturingDate: "2023-04-25",
                // productBatchExpiryDate: "2023-07-28",
                rawMaterialId: ["raw1", "raw2"],
                productName: "chips",
                productDescription: "chips",
                productCategory: "Food",
                productManufacturingLocation: "Indore",
                productQuantity: "50",
                productManufacturingPrice: "1000",
                productManufacturingDate: "2023-04-25",
                productExpiryDate: "2023-08-22",
                productIngredients: "awaited Data",
                type: "product",
                productSKU: "uniqueXYZ",
                productGTIN: "GTINXYZ",
                productImage: "chips" 
            },
        ];

        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState(product.productId, Buffer.from(stringify(sortKeysRecursive(product))));
            console.info(`Product ${product.productId} initialized`);
        }
    }

    // CreateProduct issues a new product to the world state with given details.
    async CreateProduct(ctx, productId, productBatchNo,productBatchManufacturingDate, productBatchExpiryDate,rawMaterialId, productName, productDescription, productCategory, productManufacturingLocation, productQuantity, productManufacturingPrice, productManufacturingDate, productExpiryDate, productIngredients, productSKU, productGTIN, productImage) {
        // Only Manufacturer Organization can create new product
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'ManufacturerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to create product`);
        }
        // check for already existing products
        const exists = await this.ProductExists(ctx, productId);
        if (exists) {
            throw new Error(`This product ${productId} already exists`);
        }
        
        const product = {
            productId : productId,
            manufacturerId: ctx.clientIdentity.getID(),
            productBatchNo: productBatchNo,
            productBatchManufacturingDate: productBatchManufacturingDate,
            productBatchExpiryDate: productBatchExpiryDate,
            rawMaterialId: rawMaterialId,
            productName: productName,
            productDescription: productDescription,
            productCategory: productCategory,
            productManufacturingLocation: productManufacturingLocation,
            productQuantity: productQuantity,
            productManufacturingPrice: productManufacturingPrice,
            productManufacturingDate: productManufacturingDate,
            productExpiryDate: productExpiryDate,
            productIngredients: productIngredients,
            type: "product",
            productSKU: productSKU,
            productGTIN: productGTIN,
            productImage: productImage
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(productId, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    async UpdateProduct(ctx, productId, productBatchNo, productBatchManufacturingDate,productBatchExpiryDate,rawMaterialId, productName, productDescription, productCategory, productManufacturingLocation, productQuantity, productManufacturingPrice, productManufacturingDate,productExpiryDate, productIngredients, productSKU, productGTIN,productImage){
        // Only Manufacturer Organization can update product
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'ManufacturerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to update product`);
        }

        const exists = await this.ProductExists(ctx, productId);
        if (!exists) {
            throw new Error(`This product ${productId} does not exist`);
        }
        
        const updateProduct = {
            productId : productId,
            manufacturerId: ctx.clientIdentity.getID(),
            productBatchNo: productBatchNo,
            productBatchManufacturingDate: productBatchManufacturingDate,
            productBatchExpiryDate: productBatchExpiryDate,
            rawMaterialId: rawMaterialId,
            productName: productName,
            productDescription: productDescription,
            productCategory: productCategory,
            productManufacturingLocation: productManufacturingLocation,
            productQuantity: productQuantity,
            productManufacturingPrice: productManufacturingPrice,
            productManufacturingDate: productManufacturingDate,
            productExpiryDate: productExpiryDate,
            productIngredients: productIngredients,
            type: "product",
            productSKU: productSKU,
            productGTIN: productGTIN,
            productImage: productImage
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(productId, Buffer.from(stringify(sortKeysRecursive(updateProduct))));
    }

    // GetProductById returns the product stored in the world state with given id.
    async GetProductById(ctx, productId) {
        const productJSON = await ctx.stub.getState(productId); // get the product from chaincode state
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${productId} does not exist`);
        }
        return productJSON.toString();
    }

    // DeleteProduct deletes a given product from the world state.
    async DeleteProduct(ctx, productId) {
        
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'ManufacturerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to delete product`);
        }
        
        const exists = await this.ProductExists(ctx, productId);
        if (!exists) {
            throw new Error(`The product ${productId} does not exist`);
        }
        return ctx.stub.deleteState(productId);
    }

    // RawMaterialExists returns true when raw material with given ID exists in world state.
    async ProductExists(ctx, productId) {
        const productJSON = await ctx.stub.getState(productId);
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