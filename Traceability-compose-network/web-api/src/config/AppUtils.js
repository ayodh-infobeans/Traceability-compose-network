/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import fs from 'fs';
import path from 'path';
import constants from '../config.constants.js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildCCPOrg1 = () => {
	// load the common connection configuration file
	const ccpPath = path.resolve(constants.ConnectionProfilePath,'..', '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

const buildCCPOrg2 = () => {
	// load the common connection configuration file
	const ccpPath = path.resolve(constants.ConnectionProfilePath, '..', '..', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

// const buildCCPOrg3 = () => {
// 	// load the common connection configuration file
// 	const ccpPath = path.resolve(constants.ConnectionProfilePath,  'HLF_CONNECTION_PROFILE_wholesaler.json');
// 	const fileExists = fs.existsSync(ccpPath);
// 	if (!fileExists) {
// 		throw new Error(`no such file or directory: ${ccpPath}`);
// 	}
// 	const contents = fs.readFileSync(ccpPath, 'utf8');

// 	// build a JSON object from the file contents
// 	const ccp = JSON.parse(contents);

// 	console.log(`Loaded the network configuration located at ${ccpPath}`);
// 	return ccp;
// };

const buildWallet = async (Wallets, walletPath) => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
	if (walletPath) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
};

const prettyJSONString = (inputString) => {
	if (inputString) {
		 return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		 return inputString;
	}
}

export default {
    buildCCPOrg1,
    buildCCPOrg2,
    buildWallet,
    prettyJSONString
}