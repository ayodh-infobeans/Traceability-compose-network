#!/usr/bin/env node
//
// SPDX-License-Identifier: Apache-2.0
//
const { spawn } = require('child_process');

const corePeerTlsEnabled = process.env.CORE_PEER_TLS_ENABLED || "false";
const debug = process.env.DEBUG || "false";

let command = "";
let args = [];
if (debug.toLowerCase() === "true") {
    command = "npm";
    args = ["run", "start:server-debug"];
} else if (corePeerTlsEnabled.toLowerCase() === "true") {
    command = "npm";
    args = ["run", "start:server"];
} else {
    command = "npm";
    args = ["run", "start"];
}

const childProcess = spawn(command, args);

childProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

childProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

childProcess.on('error', (err) => {
    console.error(`child process error: ${err}`);
});
