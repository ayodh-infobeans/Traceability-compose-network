/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const RawMaterialTransfer = require('./lib/rawMaterialTransfer');
const ProductContract = require('./lib/productContract');
// import ProductContract from './lib/productContract';
console.log(ProductContract);
// console.log(RawMaterialTransfer);
module.exports.RawMaterialTransfer = RawMaterialTransfer;
module.exports.ProductContract = ProductContract;
module.exports.contracts = [ProductContract, RawMaterialTransfer];
