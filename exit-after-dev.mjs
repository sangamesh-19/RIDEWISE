import { exec } from 'child_process';

const devProcess = exec('vite', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  process.exit(0); // Exit after running the development server
});

devProcess.stdout.pipe(process.stdout);
devProcess.stderr.pipe(process.stderr);
