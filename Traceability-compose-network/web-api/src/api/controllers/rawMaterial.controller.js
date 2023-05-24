import httpStatus from 'http-status';
import pkg from 'fabric-network';
const { Gateway, Wallets } = pkg;
import fs from 'fs';
import path from 'path';
import buildCCP from '../../config/buildCCP.js';
import ConnectGateway from '../utils/gateway.util.js';
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

const CreateRawMaterial = async(req, res) =>{
    try{
        let OrgMSP = req.body.org;
        let userId = req.body.userName;
        let userSession = app.getSession();
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
            let result = await contract.evaluateTransaction("RawMaterialTransfer:checkRawMaterialAvailabilty", data.rawMaterialName, data.rawMaterialQuantity);

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

export default{
    GetAllRawMaterial,
    CreateRawMaterial,
    UpdateRawMaterial,
    DeleteRawMaterial,
    CheckRawMaterialAvailability,
    GetRawMaterialById
}