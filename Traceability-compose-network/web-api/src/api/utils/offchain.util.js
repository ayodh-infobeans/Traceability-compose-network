import {spawn} from 'child_process';
import path from 'path';

let childProcess;

const workingDirectory = `./src/api/offchaindb`;
const scriptPath = path.join(workingDirectory, 'blockEventListener.js');


const setOrgChannel = (org, channelName, network) =>{

    let additionalArgs = [org, channelName];
    let options = [scriptPath, ...additionalArgs, network];

    return options;
    

}


const runOffchainScript = (command, options) =>{
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

const stopOffchainScript = () =>{
  if (childProcess) {
    console.log('Stopping script...');
    childProcess.kill('SIGINT');
    
  } else {
    console.log('No script is currently running.');
  }
}


export default{
    stopOffchainScript,
    runOffchainScript,
    setOrgChannel
}





// // Set the desired working directory

// // Call the function with the terminal command and options
// runOffchainScript(command, options);

// // Example: Stop the script by sending a command
// stopOffchainScript();
