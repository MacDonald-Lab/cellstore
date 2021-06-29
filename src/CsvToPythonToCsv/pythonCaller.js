//import { spawn } from 'child_process';
const { spawn } = require('child_process');

//const childPython = spawn('py', ['--version']);  Use this line to test if the py command works. Depending how python was installed you may need a different command line implementation

function runPython(scriptName){
    const childPython = spawn('py', [scriptName]);

    childPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });


    childPython.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });


    childPython.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

}

runPython('SimplifiedCsvToPythonToCsvReader.py'); //function with a python file passed in