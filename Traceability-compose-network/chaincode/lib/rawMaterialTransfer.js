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
        if (mspid !== 'GrowerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to initialize raw materials`);
        }

        const rawMaterials = [
            {
                rawID: 'raw1',
                rawMaterialName: 'Tomato',
                rawMaterialCategory: 'Vegetable',
                rawMaterialLocation: 'Indore',
                rawMaterialQuantity: 22,
                rawMaterialPrice: '200',
                type: 'rawMaterial',
                rawMaterialDescription: 'Tomato',
                rawMaterialProductionDate: '2023-04-21',
                rawMaterialExpiryDate: '2023-09-01',
                rawMaterialSpecifications: 'Data to be awaited',
                rawMaterialCultivationMethod: 'Data to be awaited',
                rawMaterialFertilizers: 'Data to be awaited',
                rawMaterialStatus: 'In Stock',
                rawMaterialImage: 'Tomato',
                rawMaterialOwner: 'Ayodh'
            },
        ];

        for (const rawMaterial of rawMaterials) {
            rawMaterial.docType = 'rawMaterial';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(rawMaterial.rawID, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
            console.info(`RawMaterial ${rawMaterial.rawID} initialized`);
        }
    }

    // CreateRawMaterial issues a new raw material to the world state with given details.
    async CreateRawMaterial(ctx, rawId, rawMaterialName, rawMaterialCategory, rawMaterialLocation, rawMaterialQuantity, rawMaterialPrice, rawMaterialDescription, rawMaterialProductionDate, rawMaterialExpiryDate, rawMaterialSpecifications, rawMaterialCultivationMethod, rawMaterialFertilizers, rawMaterialImage) {
        // Only Grower Organization can create new raw material
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'GrowerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to create raw materials`);
        }
        // check for already existing raw materials
        const exists = await this.RawMaterialExists(ctx, rawId);
        if (exists) {
            throw new Error(`This Raw Material ${rawId} already exists`);
        }
        
        const rawMaterial = {
            rawID: rawId,
            rawMaterialName: rawMaterialName,
            rawMaterialCategory: rawMaterialCategory,
            rawMaterialLocation: rawMaterialLocation,
            rawMaterialQuantity: rawMaterialQuantity,
            rawMaterialPrice: rawMaterialPrice,
            type: 'rawMaterial',
            rawMaterialDescription: rawMaterialDescription,
            rawMaterialProductionDate: rawMaterialProductionDate,
            rawMaterialExpiryDate: rawMaterialExpiryDate,
            rawMaterialSpecifications: rawMaterialSpecifications,
            rawMaterialCultivationMethod: rawMaterialCultivationMethod,
            rawMaterialFertilizers: rawMaterialFertilizers,
            rawMaterialImage: rawMaterialImage,
            rawMaterialOwner: ctx.clientIdentity.getID()
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(rawId, Buffer.from(stringify(sortKeysRecursive(rawMaterial))));
        return JSON.stringify(rawMaterial);
    }

    // GetRawMaterialById returns the raw material stored in the world state with given id.
    async GetRawMaterialById(ctx, rawId) {
        const rawMaterialJSON = await ctx.stub.getState(rawId); // get the asset from chaincode state
        if (!rawMaterialJSON || rawMaterialJSON.length === 0) {
            throw new Error(`The raw material ${rawId} does not exist`);
        }
        return rawMaterialJSON.toString();
    }

    // UpdateRawMaterial updates an existing raw material in the world state with provided parameters.
    async UpdateRawMaterial(ctx, rawId, rawMaterialName, rawMaterialCategory, rawMaterialLocation, rawMaterialQuantity, rawMaterialPrice, rawMaterialDescription, rawMaterialProductionDate, rawMaterialExpiryDate, rawMaterialSpecifications, rawMaterialCultivationMethod, rawMaterialFertilizers, rawMaterialImage) {
        // Only Grower organizations are allowed to update raw materials
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'GrowerMSP') {
        throw new Error(`Caller with MSP ID ${mspid} is not authorized to update raw materials`);
        }
        
        const exists = await this.RawMaterialExists(ctx, rawId);
        if (!exists) {
            throw new Error(`This raw material ${rawId} does not exist`);
        }

        // overwriting original raw material with new raw material
        const updatedRawMaterial = {
            rawID: rawId,
            rawMaterialName: rawMaterialName,
            rawMaterialCategory: rawMaterialCategory,
            rawMaterialLocation: rawMaterialLocation,
            rawMaterialQuantity: rawMaterialQuantity,
            rawMaterialPrice: rawMaterialPrice,
            type: 'rawMaterial',
            rawMaterialDescription: rawMaterialDescription,
            rawMaterialProductionDate: rawMaterialProductionDate,
            rawMaterialExpiryDate: rawMaterialExpiryDate,
            rawMaterialSpecifications: rawMaterialSpecifications,
            rawMaterialCultivationMethod: rawMaterialCultivationMethod,
            rawMaterialFertilizers: rawMaterialFertilizers,
            rawMaterialImage: rawMaterialImage,
            rawMaterialOwner: ctx.clientIdentity.getID()
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(rawId, Buffer.from(stringify(sortKeysRecursive(updatedRawMaterial))));
    }

    // DeleteRawMaterial deletes an given raw material from the world state.
    async DeleteRawMaterial(ctx, rawID) {
        
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'GrowerMSP') {
            throw new Error(`Caller with MSP ID ${mspid} is not authorized to delete raw material`);
        }
        
        const exists = await this.RawMaterialExists(ctx, rawID);
        if (!exists) {
            throw new Error(`The raw material ${rawID} does not exist`);
        }
        return ctx.stub.deleteState(rawID);
    }

    // RawMaterialExists returns true when raw material with given ID exists in world state.
    async RawMaterialExists(ctx, rawID) {
        const rawMaterialJSON = await ctx.stub.getState(rawID);
        return rawMaterialJSON && rawMaterialJSON.length > 0;
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
 // // ShipRawMaterial from Grower to Manufacturer 
    // async ShipRawMaterial(ctx, rawId) {
    //     const mspId = ctx.clientIdentity.getMSPID();
    //     if (mspId !== 'GrowerMSP') {
    //         throw new Error('Unauthorized. Only users belonging to the Grower organization can ship raw materials.');
    //     }

    //     const rawMaterial  = JSON.parse(ctx.GetRawMaterialById(rawId));
    //     if (rawMaterial.rawMaterialOwner !== ctx.clientIdentity.getID()) {
    //         throw new Error(`Unauthorized. Only the owner of raw materials with ID ${rawId} can ship it.`);
    //     }

    //     const shippedRawMaterial = {
    //         rawID: rawMaterial.rawID,
    //         rawMaterialName: rawMaterial.rawMaterialName,
    //         rawMaterialCategory: rawMaterial.rawMaterialCategory,
    //         rawMaterialLocation: rawMaterial.rawMaterialLocation,
    //         rawMaterialQuantity: rawMaterial.rawMaterialQuantity,
    //         rawMaterialPrice: rawMaterial.rawMaterialPrice,
    //         rawMaterialType: rawMaterial.rawMaterialType,
    //         rawMaterialDescription: rawMaterial.rawMaterialDescription,
    //         rawMaterialProductionDate: rawMaterial.rawMaterialProductionDate,
    //         rawMaterialExpiryDate: rawMaterial.rawMaterialExpiryDate,
    //         rawMaterialSpecifications: rawMaterial.rawMaterialSpecifications,
    //         rawMaterialCultivationMethod: rawMaterial.rawMaterialCultivationMethod,
    //         rawMaterialFertilizers: rawMaterial.rawMaterialFertilizers,
    //         rawMaterialStatus: 'Shipped',
    //         rawMaterialImage: rawMaterial.rawMaterialImage,
    //         rawMaterialOwner: ctx.clientIdentity.getID()
    //     }

    //     // const shippedRawMaterialKey = ctx.stub.createCompositeKey('supplychain.rawMaterial.shipped', [shippedRawMaterial.rawID]);
    //     await ctx.stub.putState(shippedRawMaterial.rawID, Buffer.from(JSON.stringify(shippedRawMaterial)));
    // }

    // // ReceiveRawMaterial from Grower to Manufacturer
    // async ReceiveRawMaterial(ctx, rawID) {
    //     const mspId = ctx.clientIdentity.getMSPID();
    //     if (mspId !== 'Org2MSP') {
    //         throw new Error('Unauthorized. Only users belonging to the Manufacturer organization can receive raw materials.');
    //     }

    //     const rawMaterial  = JSON.parse(ctx.GetRawMaterialById(rawID));

    //     const receivedRawMaterial = {
    //         rawID: rawMaterial.rawID,
    //         rawMaterialName: rawMaterial.rawMaterialName,
    //         rawMaterialCategory: rawMaterial.rawMaterialCategory,
    //         rawMaterialLocation: rawMaterial.rawMaterialLocation,
    //         rawMaterialQuantity: rawMaterial.rawMaterialQuantity,
    //         rawMaterialPrice: rawMaterial.rawMaterialPrice,
    //         rawMaterialType: rawMaterial.rawMaterialType,
    //         rawMaterialDescription: rawMaterial.rawMaterialDescription,
    //         rawMaterialProductionDate: rawMaterial.rawMaterialProductionDate,
    //         rawMaterialExpiryDate: rawMaterial.rawMaterialExpiryDate,
    //         rawMaterialSpecifications: rawMaterial.rawMaterialSpecifications,
    //         rawMaterialCultivationMethod: rawMaterial.rawMaterialCultivationMethod,
    //         rawMaterialFertilizers: rawMaterial.rawMaterialFertilizers,
    //         rawMaterialStatus: 'Raw Material Received to manufacturer',
    //         rawMaterialImage: rawMaterial.rawMaterialImage,
    //         rawMaterialOwner: ctx.clientIdentity.getID()
    //     }

    //     await ctx.stub.putState(receivedRawMaterial.rawID, Buffer.from(JSON.stringify(receivedRawMaterial)));
    // }

    // async checkRawMaterialAvailabilty(ctx, searchRawMaterial, rawMaterialQuantity) {
    //     const allRawMaterials = await this.GetAllRawMaterials(ctx);
    //     const data = JSON.parse(allRawMaterials);
    //     const result = data.filter((item)=> item.rawMaterialName === searchRawMaterial);
    //     if(result.length !== 0){
    //         if(rawMaterialQuantity <= result[0].rawMaterialQuantity){
    //             return "Raw material is available in required quantity : "+ JSON.stringify(result);
    //         }
    //         else{
    //             return "Raw material is not available in required quantity";
    //         }
    //     }
    //     else{
    //         return "Raw material is not available"; 
    //     }
    // }