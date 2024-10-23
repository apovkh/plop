import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import { NodePlopAPI, Answers } from 'plop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesPath = path.join(__dirname, '../');

export default function (plop: NodePlopAPI) {
  // console.log('Codebase dir', process.env.CODEBASE_DIR);
  // console.log('Codebase module', process.env.CODEBASE_LK_MODULE);
  // process.exit(1);

  if (!fs.existsSync(modulesPath)) {
    console.error(`Modules directory does not exist at path: ${modulesPath}`);
    process.exit(1);
  }

  const moduleDirectories = fs.readdirSync(modulesPath).filter((file) => {
    return fs.statSync(path.join(modulesPath, file)).isDirectory();
  });

  plop.setPrompt('autocomplete', autocompletePrompt);

  plop.setGenerator('module', {
    description: 'Generate a module for Vue component with selected features',
    prompts: [
      {
        type: 'autocomplete',
        name: 'module',
        message: 'Select the module directory or create a new one:',
        source: (_, input) => {
          input = input || '';
          return new Promise((resolve) => {
            const filteredModules = moduleDirectories.filter((module) =>
              module.toLowerCase().includes(input.toLowerCase()),
            );
            resolve([...filteredModules, 'Create a new module']);
          });
        },
        validate: (value) => (value ? true : 'Module selection is required.'),
      },
      {
        type: 'input',
        name: 'moduleName',
        message: 'Enter the new module name (PascalCase):',
        when: (answers) => answers.module === 'Create a new module',
        validate: (value) => (value ? true : 'Module name is required.'),
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name (PascalCase):',
        validate: (value) => (value ? true : 'Component name must be in PascalCase.'),
      },
      {
        type: 'confirm',
        name: 'confirmCreation',
        message: (answers) => {
          const moduleName =
            answers.module === 'Create a new module' ? answers.moduleName : answers.module;
          return `You are about to generate the following files in module: ${plop.getHelper('pascalCase')(moduleName)}/src/components/\n
          Component: ${plop.getHelper('pascalCase')(answers.componentName)}.vue\n
          Do you want to proceed?`;
        },
      },
    ],
    actions: (data: Answers | undefined) => {
      if (!data.confirmCreation) {
        return [];
      }

      const moduleName = data.module === 'Create a new module' ? data.moduleName! : data.module;
      const componentFolder = path.join(modulesPath, moduleName, 'src/components');

      const newModulePath = path.join(modulesPath, moduleName);
      if (data.module === 'Create a new module' && !fs.existsSync(newModulePath)) {
        fs.mkdirSync(newModulePath, { recursive: true });
        console.log(`Created new module: ${newModulePath}`);
      }

      if (!fs.existsSync(componentFolder)) {
        fs.mkdirSync(componentFolder, { recursive: true });
      }

      return [
        {
          type: 'add',
          path: `${componentFolder}/${data.componentName}.vue`,
          templateFile: path.join(__dirname, './generators/component/stubs', 'component.hbs'),
        },
        {
          type: 'add',
          path: `${componentFolder}/${data.componentName}.setup.ts`,
          templateFile: path.join(__dirname, './generators/component/stubs', 'component-setup.hbs'),
        },
        {
          type: 'add',
          path: `${componentFolder}/${data.componentName}.types.ts`,
          templateFile: path.join(__dirname, './generators/component/stubs', 'component-types.hbs'),
        },
        {
          type: 'add',
          path: `${componentFolder}/index.ts`,
          templateFile: path.join(__dirname, './generators/component/stubs', 'barrel.hbs'),
        }
      ];
    },
  });
}
