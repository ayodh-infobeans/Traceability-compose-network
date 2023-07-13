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

class RawMaterialTransfer extends Contract {

    async InitLedger(ctx) {

        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to initialize raw materials`);
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
                owner: 'Ayodh',
            },
        ];

        for (const rawMaterial of rawMaterials) {
            rawMaterial.docType = 'rawMaterial';
            await ctx.stub.putState("RM_"+rawMaterial.id, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
            console.info(`RawMaterial ${rawMaterial.id} initialized`);
        }
    }

    // CreateRawMaterial issues a new raw material to the world state with given details.
    async CreateRawMaterial(ctx, id, name, category, location, quantity, price, description, productionDate, expiryDate, specifications, cultivationMethod, fertilizers, image, createdAt, updatedAt) {
        // Only Grower Organization can create new raw material
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to create raw materials`);
        }
        // check for already existing raw materials
        // const id = uuidv4();
        const exists = await this.RawMaterialExists(ctx, id);
        if (exists) {
            throw new Error(`This Raw Material ${id} already exists`);
        }
        
        // const assetExists = await this.assetExistsByName(ctx, "rawMaterial" ,name);
        // if(assetExists){
        //     throw new Error(`This Raw Material ${id} already exists`);
        // }
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
            owner: ctx.clientIdentity.getID(),
            createdAt:createdAt,
            updatedAt:updatedAt,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result = await ctx.stub.putState("RM_"+rawMaterial.id, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
        return JSON.stringify(result);
    }

    // GetRawMaterialById returns the raw material stored in the world state with given id.
    async GetRawMaterialById(ctx, id) {
        const resultantJSON = await ctx.stub.getState("RM_"+id); // get the asset from chaincode state
        if (!resultantJSON || resultantJSON.length === 0) {
            throw new Error(`The raw material ${id} does not exist`);
        }
        return resultantJSON.toString();
    }

    // UpdateRawMaterial updates an existing raw material in the world state with provided parameters.
    async UpdateRawMaterial(ctx, id, name, category, location, quantity, price, description, productionDate, expiryDate, specifications, cultivationMethod, fertilizers, image, updatedAt) {
        // Only Grower organizations are allowed to update raw materials
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
        throw new Error(`Caller with MSP ID ${mspid} is not authorized to update raw materials`);
        }
        
        const exists = await this.RawMaterialExists(ctx, id);
        if (!exists) {
            throw new Error(`This raw material ${id} does not exist`);
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
            owner: ctx.clientIdentity.getID(),
            updatedAt:updatedAt,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        let result= ctx.stub.putState("RM_"+id, Buffer.from(stringify(sortKeysRecursive(updatedRawMaterial))));
        return JSON.stringify(result);
    }

    // DeleteRawMaterial deletes an given raw material from the world state.
    async DeleteRawMaterial(ctx, id) {
        
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org1MSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to delete raw material`);
        }
        
        const exists = await this.RawMaterialExists(ctx,id);
        if (!exists) {
            throw new Error(`The raw material ${id} does not exist`);
        }
        return ctx.stub.deleteState("RM_"+id);
    }

    // RawMaterialExists returns true when raw material with given ID exists in world state.
    async RawMaterialExists(ctx, id) {
        const resultantJSON = await ctx.stub.getState("RM_"+id);
        return resultantJSON && resultantJSON.length > 0;
    }

    async assetExistsByName(ctx, assetName) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('product', []);
      
        while (true) {
          const response = await iterator.next();
            
          if (response.value && response.value.key) {
            const splitKey = ctx.stub.splitCompositeKey(response.value.key);
            const objectType = splitKey.objectType;
            const attributes = splitKey.attributes;
      
            if (objectType === 'Product' && attributes.length > 0 && attributes[0] === assetName) {
              await iterator.close();
              return true; // Product with the given name exists
            }
          }
      
          if (response.done) {
            await iterator.close();
            break;
          }
        }
      
        return false; // Product with the given name does not exist
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