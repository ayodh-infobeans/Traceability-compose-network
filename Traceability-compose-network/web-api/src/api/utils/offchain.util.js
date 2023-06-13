import {spawn} from 'child_process';
import path from 'path';

let childProcess;

const workingDirectory = `./src/api/offchaindb`;
const scriptPath = path.join(workingDirectory, 'blockEventListener.js');
// Change the working directory
// process.chdir(workingDirectory);


const setOrgChannel = (org, channelName) =>{

    let additionalArgs = [org, channelName];
    let options = [scriptPath, ...additionalArgs];

    return options;

}


const runTerminalCommand = (command, options) =>{
  console.log("Path checking",options);
  childProcess = spawn(command, options);

  childProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

const stopScript = () =>{
  if (childProcess) {
    console.log('Stopping script...');
    childProcess.kill('SIGINT');
    // process.exit(0);
  } else {
    console.log('No script is currently running.');
  }
}

// Call the function with the terminal command

// runTerminalCommand('node blockEventListener.js');


export default{
    stopScript,
    runTerminalCommand,
    setOrgChannel
}





// // Set the desired working directory

// // Call the function with the terminal command and options
// runTerminalCommand(command, options);

// // Example: Stop the script by sending a command
// stopScript();
