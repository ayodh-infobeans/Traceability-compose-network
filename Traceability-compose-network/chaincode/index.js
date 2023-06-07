/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const RawMaterialTransfer = require('./lib/rawMaterialTransfer');
const ProductContract = require('./lib/productContract');
const PaymentContract = require('./lib/paymentContract');
const OrderContract=require('./lib/orderContract');

// import ProductContract from './lib/productContract';
console.log(ProductContract);
// console.log(RawMaterialTransfer);
module.exports.RawMaterialTransfer = RawMaterialTransfer;
module.exports.ProductContract = ProductContract;
module.exports.PaymentContract = PaymentContract;
module.exports.OrderContract = OrderContract;

module.exports.contracts = [ProductContract, RawMaterialTransfer, PaymentContract ,OrderContract];


