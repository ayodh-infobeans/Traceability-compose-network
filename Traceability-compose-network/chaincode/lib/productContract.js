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
const { createCustomeError } = require('./error/customError');

class ProductContract extends Contract {
    async InitProducts(ctx) {

        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to initialize products`);
        }

        const products = [
            {
                orgMSP:mspid,
                id : 'test',
                manufacturerId: "Man1",
                batchNo: 2,
                batchManufacturingDate: "2023-04-25",
                batchExpiryDate: "2023-07-28",
                rawMaterialIds: ["raw1", "raw2"],
                name: "chips",
                description: "chips",
                category: "Food",
                manufacturingLocation: "Indore",
                quantity: "50",
                manufacturingPrice: "1000",
                manufacturingDate: "2023-04-25",
                expiryDate: "2023-08-22",
                ingredients: "awaited Data",
                temprature:"27",
                type: "product",
                SKU: "uniqueXYZ",
                GTIN: "GTINXYZ",
                image: "chips" 
            },
        ];

        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState("prod_"+product.id, Buffer.from(stringify(sortKeysRecursive(product))));
            console.info(`Product ${product.id} initialized`);
        }
    }

    // CreateProduct issues a new product to the world state with given details.
    async CreateProduct(ctx, id, rawMaterialIds, name, description, category, manufacturingLocation, quantity, manufacturingPrice, manufacturingDate, expiryDate, ingredients,temprature, SKU, GTIN, image) {
        // Only Manufacturer Organization can create new product
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to create product`);
        }
        // check for already existing products
        const exists = await this.ProductExists(ctx, id);
        if (exists) {
            throw createCustomeError(`This product ${id} already exists`);
        }
        
        const assetExists = await this.assetExistsByName(ctx, name);
        if(assetExists.status){
            throw createCustomeError(`This Product ${name} already exists`);
        }

        const product = {
            orgMSP:mspid,
            id : id,
            manufacturerId: ctx.clientIdentity.getID(),
            rawMaterialIds: rawMaterialIds,
            name: name,
            description: description,
            category: category,
            manufacturingLocation: manufacturingLocation,
            quantity: quantity,
            manufacturingPrice: manufacturingPrice,
            manufacturingDate: manufacturingDate,
            expiryDate: expiryDate,
            ingredients: ingredients,
            temprature: temprature,
            type: "product",
            SKU: SKU,
            GTIN: GTIN,
            image: image
        };
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result = await ctx.stub.putState("prod_"+id, Buffer.from(stringify(sortKeysRecursive(product))));
        const nameIndexKey = "nameIndex";
        assetExists.nameIndex[name] = "prod_"+id;
        const updatedNameIndexBuffer = Buffer.from(JSON.stringify(assetExists.nameIndex));
        await ctx.stub.putState(nameIndexKey, updatedNameIndexBuffer);
        return JSON.stringify(result);
    }

    async UpdateProduct(ctx, id, rawMaterialIds, name, description, category, manufacturingLocation, quantity, manufacturingPrice, manufacturingDate, expiryDate, ingredients,temprature, SKU, GTIN, image){
        // Only Manufacturer Organization can update product
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to update product`);
        }

        const exists = await this.ProductExists(ctx, id);
        if (!exists) {
            throw createCustomeError(`This product ${id} does not exist`);
        }

        const assetBuffer = await ctx.stub.getState("prod_"+id);
        const asset = JSON.parse(assetBuffer.toString());
        let assetExists;
        if(asset.name !== name){
            assetExists = await this.assetExistsByName(ctx, name);
            if(assetExists.status){
                throw createCustomeError(`This Product ${name} already exists`);
            }
        }

        const updateProduct = {
            orgMSP:mspid,
            id : id,
            manufacturerId: ctx.clientIdentity.getID(),
            rawMaterialIds: rawMaterialIds,
            name: name,
            description: description,
            category: category,
            manufacturingLocation: manufacturingLocation,
            quantity: quantity,
            manufacturingPrice: manufacturingPrice,
            manufacturingDate: manufacturingDate,
            expiryDate: expiryDate,
            ingredients: ingredients,
            temprature: temprature,
            type: "product",
            SKU: SKU,
            GTIN: GTIN,
            image: image
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result = ctx.stub.putState("prod_"+id, Buffer.from(stringify(sortKeysRecursive(updateProduct))));
        if(asset.name !== name){
            const nameIndexKey = "nameIndex";
            assetExists.nameIndex[name] = "prod_"+id;
            const updatedNameIndexBuffer = Buffer.from(JSON.stringify(assetExists.nameIndex));
            await ctx.stub.putState(nameIndexKey, updatedNameIndexBuffer);
        }
        return JSON.stringify(result);
    }

    // GetProductById returns the product stored in the world state with given id.
    async GetProductById(ctx, id) {
        const resultJSON = await ctx.stub.getState("prod_"+id); // get the product from chaincode state
        if (!resultJSON || resultJSON.length === 0) {
            throw createCustomeError(`The product ${id} does not exist`);
        }
        return resultJSON.toString();
    }

    // DeleteProduct deletes a given product from the world state.
    async DeleteProduct(ctx, id) {
        
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org2MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to delete product`);
        }
        
        const exists = await this.ProductExists(ctx, id);
        if (!exists) {
            throw createCustomeError(`The product ${id} does not exist`);
        }
        return ctx.stub.deleteState("prod_"+id);
    }

    // RawMaterialExists returns true when raw material with given ID exists in world state.
    async ProductExists(ctx, id) {
        const resultJSON = await ctx.stub.getState("prod_"+id);
        return resultJSON && resultJSON.length > 0;
    }    

    async assetExistsByName(ctx, name) {
        // Get the name index from the world state
        const nameIndexKey = 'nameIndex'; // Key for the name index
        const nameIndexBuffer = await ctx.stub.getState(nameIndexKey);

        let nameIndex = {};
        if (nameIndexBuffer && nameIndexBuffer.length !== 0) {
            nameIndex = JSON.parse(nameIndexBuffer.toString());
        }
        if (name in nameIndex) {
            const existingProductKey = nameIndex[name];
            const existingProductBuffer = await ctx.stub.getState(existingProductKey);
            const existingProduct = JSON.parse(existingProductBuffer.toString());

            // Exclude raw material objects from duplicate name check
            if (existingProduct.type !== 'rawMaterial') {
                return {status: true, nameIndex: nameIndex};
            }
        }
      
        return {status: false, nameIndex: nameIndex}; // Product with the given name does not exist
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