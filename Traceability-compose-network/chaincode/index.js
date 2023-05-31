/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const RawMaterialTransfer = require('./lib/rawMaterialTransfer');
const ProductContract = require('./lib/productContract');
const Payment = require('./lib/payment');
const OrderContract=require('./lib/orderContract');

// import ProductContract from './lib/productContract';
console.log(ProductContract);
// console.log(RawMaterialTransfer);
module.exports.RawMaterialTransfer = RawMaterialTransfer;
module.exports.ProductContract = ProductContract;
module.exports.Payment = Payment;
module.exports.OrderContract = OrderContract;

module.exports.contracts = [ProductContract, RawMaterialTransfer, Payment,OrderContract];
