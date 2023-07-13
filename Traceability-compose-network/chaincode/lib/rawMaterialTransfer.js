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

class RawMaterialTransfer extends Contract {

    async InitLedger(ctx) {

        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to initialize raw materials`);
        }

        const rawMaterials = [
            {
                orgMSP:mspid,
                id: uuidv4(),
                name: 'Tomato',
                category: 'Vegetable',
                location: 'Indore',
                quantity: 22,
                price: 200,
                type: 'rawMaterial',
                description: 'Tomato',
                productionDate: '2023-04-21',
                expiryDate: '2023-09-01',
                specifications: 'Data to be awaited',
                cultivationMethod: 'Data to be awaited',
                fertilizers: 'Data to be awaited',
                status: 'In Stock',
                image: 'Tomato',
                owner: 'Ayodh'
            },
        ];

        for (const rawMaterial of rawMaterials) {
            rawMaterial.docType = 'rawMaterial';
            await ctx.stub.putState("RM_"+rawMaterial.id, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
            console.info(`RawMaterial ${rawMaterial.id} initialized`);
        }
    }

    // CreateRawMaterial issues a new raw material to the world state with given details.
    async CreateRawMaterial(ctx, id, name, category, location, quantity, price, description, productionDate, expiryDate, specifications, cultivationMethod, fertilizers, image) {
        // Only Grower Organization can create new raw material
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to create raw materials`);
        }
        // check for already existing raw materials
        // const id = uuidv4();
        const exists = await this.RawMaterialExists(ctx, id);
        if (exists) {
            throw createCustomeError(`This Raw Material ${id} already exists`);
        }
        
        const assetExists = await this.assetExistsByName(ctx, name);
        if(assetExists.status){
            throw createCustomeError(`This Raw Material ${name} already exists`);
        }

        const rawMaterial = {
            orgMSP:mspid,
            id: id,
            name: name,
            category: category,
            location: location,
            quantity: quantity,
            price: price,
            type: 'rawMaterial',
            description: description,
            productionDate: productionDate,
            expiryDate: expiryDate,
            specifications: specifications,
            cultivationMethod: cultivationMethod,
            fertilizers: fertilizers,
            image: image,
            owner: ctx.clientIdentity.getID()
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result = await ctx.stub.putState("RM_"+rawMaterial.id, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
        const nameIndexKey = "nameIndex";
        assetExists.nameIndex[name] = "RM_"+id;
        const updatedNameIndexBuffer = Buffer.from(JSON.stringify(assetExists.nameIndex));
        await ctx.stub.putState(nameIndexKey, updatedNameIndexBuffer);
        return JSON.stringify(result);
    }

    // GetRawMaterialById returns the raw material stored in the world state with given id.
    async GetRawMaterialById(ctx, id) {
        const resultantJSON = await ctx.stub.getState("RM_"+id); // get the asset from chaincode state
        if (!resultantJSON || resultantJSON.length === 0) {
            throw createCustomeError(`The raw material ${id} does not exist`);
        }
        return resultantJSON.toString();
    }

    // UpdateRawMaterial updates an existing raw material in the world state with provided parameters.
    async UpdateRawMaterial(ctx, id, name, category, location, quantity, price, description, productionDate, expiryDate, specifications, cultivationMethod, fertilizers, image) {
        // Only Grower organizations are allowed to update raw materials
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
        throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to update raw materials`);
        }
        
        const exists = await this.RawMaterialExists(ctx, id);
        if (!exists) {
            throw createCustomeError(`This raw material ${id} does not exist`);
        }

        const assetBuffer = await ctx.stub.getState("RM_"+id);
        const asset = JSON.parse(assetBuffer.toString());
        let assetExists;

        if(asset.name !== name){
            assetExists = await this.assetExistsByName(ctx, name);
            if(assetExists?.status && assetExists?.nameIndex){
                throw createCustomeError(`This Raw Material ${name} already exists`);
            } 
        }
        // overwriting original raw material with new raw material
        const updatedRawMaterial = {
            orgMSP:mspid,
            id: id,
            name: name,
            category: category,
            location: location,
            quantity: quantity,
            price: price,
            type: 'rawMaterial',
            description: description,
            productionDate: productionDate,
            expiryDate: expiryDate,
            specifications: specifications,
            cultivationMethod: cultivationMethod,
            fertilizers: fertilizers,
            image: image,
            owner: ctx.clientIdentity.getID()
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result= ctx.stub.putState("RM_"+id, Buffer.from(stringify(sortKeysRecursive(updatedRawMaterial))));
        if(asset.name !== name){
            const nameIndexKey = "nameIndex";
            assetExists.nameIndex[name] = "RM_"+id;
            const updatedNameIndexBuffer = Buffer.from(JSON.stringify(assetExists.nameIndex));
            await ctx.stub.putState(nameIndexKey, updatedNameIndexBuffer);
        }
        return JSON.stringify(result);
    }

    // DeleteRawMaterial deletes an given raw material from the world state.
    async DeleteRawMaterial(ctx, id) {
        
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
            throw createCustomeError(`Caller with MSP ID ${mspid} is not authorized to delete raw material`);
        }
        
        const exists = await this.RawMaterialExists(ctx,id);
        if (!exists) {
            throw createCustomeError(`The raw material ${id} does not exist`);
        }
        return ctx.stub.deleteState("RM_"+id);
    }

    // RawMaterialExists returns true when raw material with given ID exists in world state.
    async RawMaterialExists(ctx, id) {
        const resultantJSON = await ctx.stub.getState("RM_"+id);
        return resultantJSON && resultantJSON.length > 0;
    }

    async assetExistsByName(ctx, name) {
        // Get the name index from the world state
        const nameIndexKey = 'nameIndex'; // Key for the name index
        const nameIndexBuffer = await ctx.stub.getState(nameIndexKey);

        let nameIndex = {};
        if (nameIndexBuffer && nameIndexBuffer.length !== 0) {
            nameIndex = JSON.parse(nameIndexBuffer.toString());
        }
        console.log("=====================", nameIndex);
        // Check if the product name already exists in the name index
        if (name in nameIndex) {
            const existingProductKey = nameIndex[name];
            const existingProductBuffer = await ctx.stub.getState(existingProductKey);
            const existingProduct = JSON.parse(existingProductBuffer.toString());

            // Exclude raw material objects from duplicate name check
            if (existingProduct.type !== 'product') {
                return {status: true, nameIndex: nameIndex};
            }
        }
      
        return {status: false, nameIndex: nameIndex}; // Product with the given name does not exist
    }
      
      
      
    // GetAllRawMaterials returns all raw materials found in the world state.
    async GetAllRawMaterials(ctx) {
        const query = {
            "selector":{
                "type": 'rawMaterial'
            }
          };
          const queryResults = await ctx.stub.getQueryResult(JSON.stringify(query));
        
          const rawMaterials = [];
          while (true) {
            const res = await queryResults.next();
            if (res.value) {
              const rawMaterial = JSON.parse(res.value.value.toString('utf8'));
              rawMaterials.push(rawMaterial);
            } else {
              await queryResults.close();
              return JSON.stringify(rawMaterials);
            }
          }
    }

}

module.exports = RawMaterialTransfer;