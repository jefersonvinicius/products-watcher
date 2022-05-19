import cliSelect from 'cli-select';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

const EXIT_OPTION = 'Exit';

async function run() {
  console.clear();

  const files = fs.readdirSync(__dirname).filter((file) => file !== 'index.ts');
  const options = [...files, EXIT_OPTION];
  console.log('Choose a test or Exit:');
  const selected = await cliSelect({ values: options, selected: '*', unselected: '' });

  if (selected.value === EXIT_OPTION) {
    console.log('Bye :)');
    return;
  }

  const script = await import(path.join(__dirname, selected.value));
  await script.default();
  await waitForKeyPress();

  run();
}

async function waitForKeyPress() {
  const reader = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<void>((resolve) => {
    reader.question('\nPress any key to continue...', () => {
      reader.close();
      setTimeout(resolve, 500);
    });
  });
}

run();
