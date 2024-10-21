import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import { NodePlopAPI, Answers } from 'plop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesPath = path.join(__dirname, '../');

export default function (plop: NodePlopAPI) {
  
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
            const filteredModules = moduleDirectories.filter(module =>
              module.toLowerCase().includes(input.toLowerCase())
            );
            resolve([...filteredModules, 'Create a new module']);
          });
        },
        validate: (value) => (value ? true : 'Module selection is required.'),
      },
      {
        type: 'input',
        name: 'newModuleName',
        message: 'Enter the new module name (PascalCase):',
        when: (answers) => answers.module === 'Create a new module',
        validate: (value) => (value ? true : 'Module name is required.'),
      },
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
        validate: (value) => (value ? true : 'Component name must be in PascalCase.'),
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features for the component:',
        choices: ['props', 'state', 'computed', 'actions', 'events', 'watch'],
      },
      {
        type: 'input',
        name: 'composableName',
        message: 'Name for the composable (default: use component name):',
        validate: (value) => (value ? true : 'Composable name is required if you want to provide a custom name.'),
        when: (answers) => answers.features.includes('state') || answers.features.includes('computed') || answers.features.includes('actions'),
      },
      {
        type: 'input',
        name: 'helperName',
        message: 'Name for the helper (default: use component name):',
        validate: (value) => (value ? true : 'Helper name is required if you want to provide a custom name.'),
      },
      {
        type: 'confirm',
        name: 'confirmCreation',
        message: (answers) => {
          const featuresList = answers.features.length ? answers.features.join(', ') : 'No features selected';
          const moduleName = answers.module === 'Create a new module' ? answers.newModuleName : answers.module;
          return `You are about to generate the following files in module: ${plop.getHelper('pascalCase')(moduleName)}/src/components/\n
          Component: ${plop.getHelper('pascalCase')(answers.name)}.vue\n
          Features: ${featuresList}\n
          Do you want to proceed?`;
        },
      },
    ],
    actions: (data: Answers | undefined) => {
      if (!data.confirmCreation) {
        return [];
      }

      const moduleName = data.module === 'Create a new module' ? data.newModuleName! : data.module; 
      const componentFolder = path.join(modulesPath, moduleName, 'src/components');

      const newModulePath = path.join(modulesPath, moduleName);
      if (data.module === 'Create a new module' && !fs.existsSync(newModulePath)) {
        fs.mkdirSync(newModulePath, { recursive: true });
        console.log(`Created new module: ${newModulePath}`);
      }

      if (!fs.existsSync(componentFolder)) {
        fs.mkdirSync(componentFolder, { recursive: true });
      }

      const composablesFolder = path.join(modulesPath, moduleName, 'src/composables');
      if (!fs.existsSync(composablesFolder)) {
        fs.mkdirSync(composablesFolder, { recursive: true });
      }

      const helpersFolder = path.join(modulesPath, moduleName, 'src/helpers');
      if (!fs.existsSync(helpersFolder)) {
        fs.mkdirSync(helpersFolder, { recursive: true });
      }

      // Set default names if custom names are not provided
      const composableFileName = data.composableName || `use${plop.getHelper('pascalCase')(data.name)}`;
      const helperFileName = data.helperName || `${plop.getHelper('pascalCase')(data.name)}`;

      return [
        {
          type: 'add',
          path: `${componentFolder}/${plop.getHelper('pascalCase')(data.name)}.vue`,
          templateFile: path.join(__dirname, 'src/plop/component/templates', 'component.vue.hbs'),
          data: { 
            props: data.features.includes('props'),
            state: data.features.includes('state'),
            computed: data.features.includes('computed'),
            actions: data.features.includes('actions'),
            events: data.features.includes('events'),
            watch: data.features.includes('watch'),
          },
        },
        {
          type: 'add',
          path: `${componentFolder}/index.ts`,
          templateFile: path.join(__dirname, 'src/plop/component/templates', 'barel-file.ts.hbs'),
        },
        {
          type: 'add',
          path: `${componentFolder}/${plop.getHelper('pascalCase')(data.name)}Types.ts`,
          templateFile: path.join(__dirname, 'src/plop/component/templates', 'types.ts.hbs'),
        },
        {
          type: 'add',
          path: `${composablesFolder}/use${plop.getHelper('pascalCase')(composableFileName)}.ts`,
          templateFile: path.join(__dirname, 'src/plop/composables/templates', 'composable.ts.hbs'),
        },
        {
          type: 'add',
          path: `${helpersFolder}/${helperFileName}.ts`,
          templateFile: path.join(__dirname, 'src/plop/helpers/templates', 'helper.ts.hbs'),
        },
      ];
    },
  });
}
