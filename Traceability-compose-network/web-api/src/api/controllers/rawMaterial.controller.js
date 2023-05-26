import httpStatus from 'http-status';
import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import fs from 'fs';
import path from 'path';
import buildCCP from '../../config/buildCCP.js';
import ConnectGateway from '../utils/gateway.util.js';
import mongoose from 'mongoose';
import RawModel from '../../models/rawmodel.js';
import app from '../app.js';



const GetAllRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
        if(userSession != null){
            const network = await userSession.gateway.getNetwork(req.body.channelName);
            const contract = network.getContract(req.body.chaincodeName);
            let result = await contract.evaluateTransaction("RawMaterialTransfer:GetAllRawMaterials");
            if(result != null){
                res.status(200).json({
                    status: true,
                    result: result.toString()
                });
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Error ocurred in chaincode"
                })
            }
        }
        else{
            res.status(401).json({
                status: false,
                message: "you're not loggedIn. Please logIn to continue"
            })
        }
    }
    catch (error){
        res.status(500).json({
            error: error
        });
    }

}

const CreateRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
        console.log(userSession);
        if(userSession != null){
            const network = await userSession.gateway.getNetwork(req.body.channelName);
            const contract = network.getContract(req.body.chaincodeName);
            let data = req.body.data;
            let result = await contract.submitTransaction("RawMaterialTransfer:CreateRawMaterial", data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers, data.rawMaterialStatus, data.rawMaterialImage);

            if(result != null){
                res.status(200).json({
                    status: true,
                    result: "Raw Materials created successfully"
                });
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Error ocurred in chaincode"
                })
            }
        await new Promise(resolve => setTimeout(resolve, 5000));
        const obj = await RawModel.findOne({rawID:data.rawID});
        console.log(obj);
        if (obj.toString()) {
            obj.org= req.body.org;
            obj.userName= req.body.userName;
            obj.userType= req.body.userType;
            obj.channelName= req.body.channelName;
            obj.chaincodeName= req.body.chaincodeName;
            // Save the modified document back to the database
            await obj.save();
            console.log('Document updated successfully.');
          } else {
            console.log('Document not found.');
          }
        }
        else{
            res.status(401).json({
                status: false,
                message: "you're not loggedIn. Please logIn to continue"
            })
        }
    }
    catch (error){
        res.status(500).json({
            error: error
        });
    }
}


const UpdateRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
        if(userSession != null){
            const network = await userSession.gateway.getNetwork(req.body.channelName);
            const contract = network.getContract(req.body.chaincodeName);
            let data = req.body.data;
            let result = await contract.submitTransaction('RawMaterialTransfer:UpdateRawMaterial', data.rawID, data.rawMaterialName, data.rawMaterialCategory, data.rawMaterialLocation, data.rawMaterialQuantity, data.rawMaterialPrice, data.rawMaterialDescription, data.rawMaterialProductionDate, data.rawMaterialExpiryDate, data.rawMaterialSpecifications, data.rawMaterialCultivationMethod, data.rawMaterialFertilizers, data.rawMaterialStatus, data.rawMaterialImage);

            if(result != null){
                res.status(200).json({
                    status: true,
                    result: "Raw Materials updated successfully"
                });
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Error ocurred in chaincode"
                })
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            const obj = await RawModel.findOne({rawID:data.rawID});
            console.log(obj);
            if (obj.toString()) {
                obj.org= req.body.org;
                obj.userName= req.body.userName;
                obj.userType= req.body.userType;
                obj.channelName= req.body.channelName;
                obj.chaincodeName= req.body.chaincodeName;
                // Save the modified document back to the database
                await obj.save();
                console.log('Document updated successfully.');
          } else {
            console.log('Document not found.');
          }
        }
        else{
            res.status(401).json({
                status: false,
                message: "you're not loggedIn. Please logIn to continue"
            })
        }
    }
    catch (error){
        res.status(500).json({
            error: error
        });
    }
}

const GetRawMaterialById = async(req, res) => {
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
        if(userSession != null){
            const network = await userSession.gateway.getNetwork(req.body.channelName);
            const contract = network.getContract(req.body.chaincodeName);
            let data = req.body.data;
            let result = await contract.evaluateTransaction("RawMaterialTransfer:GetRawMaterialById", data.rawID);

            if(result != null){
                res.status(200).json({
                    status: true,
                    result: result
                });
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Error ocurred in chaincode"
                })
            }
        }
        else{
            res.status(401).json({
                status: false,
                message: "you're not loggedIn. Please logIn to continue"
            })
        }
    }
    catch (error){
        res.status(500).json({
            error: error
        });
    }
}

const DeleteRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
        if(userSession != null){
            const network = await userSession.gateway.getNetwork(req.body.channelName);
            const contract = network.getContract(req.body.chaincodeName);
            let data = req.body.data;
            let result = await contract.submitTransaction("RawMaterialTransfer:DeleteRawMaterial", data.rawID);

            if(result != null){
                res.status(200).json({
                    status: true,
                    result: result,
                    message: "Raw Material deleted successfully"
                });
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Error ocurred in chaincode"
                })
            }
        }
        else{
            res.status(401).json({
                status: false,
                message: "you're not loggedIn. Please logIn to continue"
            })
        }
    }
    catch (error){
        res.status(500).json({
            error: error
        });
    }
}

const CheckRawMaterialAvailability = async(req, res)=>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
        if(userSession != null){

            const network = await userSession.gateway.getNetwork(req.body.channelName);
            const contract = network.getContract(req.body.chaincodeName);
            let data = req.body.data;
            const rawObj = await RawModel.find({rawMaterialName: data.rawMaterialName});

            if(rawObj.toString()){
                const obj=await RawModel.find({ $and: [{rawMaterialName: data.rawMaterialName},{rawMaterialQuantity: {$gte:data.rawMaterialQuantity}}]});                
                if(obj.toString()){
                    // return "Raw material is available in required quantity : "+ JSON.stringify(result);
                    res.status(200).json({
                        status: true,
                        result: "This "+ JSON.stringify(rawObj) + "raw material is available in required quantity"
                    });
                }
                else{
                    res.status(500).json({
                        status: false,
                        message: "Raw material is not available in required quantity"
                    })
                }
            }
            else{
                res.status(500).json({
                    status: false,
                    message: "Raw material is not available"
                })
            }
        }
        else{
            res.status(401).json({
                status: false,
                message: "you're not loggedIn. Please logIn to continue"
            })
        }
    }
    catch (error){
        res.status(500).json({
            error: error
        });
    }
}

export default{
    GetAllRawMaterial,
    CreateRawMaterial,
    UpdateRawMaterial,
    DeleteRawMaterial,
    CheckRawMaterialAvailability,
    GetRawMaterialById
}