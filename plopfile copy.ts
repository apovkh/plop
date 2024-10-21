import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import autocompletePrompt from 'inquirer-autocomplete-prompt';
// @ts-ignore nex-line
import { NodePlopAPI, Answers } from 'plop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function (plop: NodePlopAPI) {
  const modulesPath = path.join(__dirname, 'modules');

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
        type: 'confirm',
        name: 'confirmCreation',
        message: (answers) => {
          const featuresList = answers.features.length ? answers.features.join(', ') : 'No features selected';
          const moduleName = answers.module === 'Create a new module' ? answers.newModuleName : answers.module;
          return `You are about to generate the following files in module: ${plop.getHelper('pascalCase')(moduleName)}/src/ui/components/${answers.folder || ''}\n
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
      const name = '{{pascalCase name}}';
      const componentFolder = `modules/${moduleName}/src/ui/components/${name}`;

      const newModulePath = path.join(modulesPath, moduleName);
      if (data.module === 'Create a new module' && !fs.existsSync(newModulePath)) {
        fs.mkdirSync(newModulePath, { recursive: true });
        console.log(`Created new module: ${newModulePath}`);
      }

      return [
        {
          type: 'add',
          path: `${componentFolder}/${name}.vue`,
          templateFile: './plop-templates/component.vue.hbs',
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
          path: `${componentFolder}/${name}.spec.ts`,
          templateFile: './plop-templates/unit-test.spec.hbs',
        },
        {
          type: 'add',
          path: `${componentFolder}/index.ts`,
          templateFile: './plop-templates/barel-file.ts.hbs',
        },
        {
          type: 'add',
          path: `${componentFolder}/I${name}Types.ts`,
          templateFile: './plop-templates/component-types.ts.hbs',
        },
        {
          type: 'add',
          path: `${componentFolder}/i18n.ts`,
          templateFile: './plop-templates/i18n.ts.hbs',
          data: { name: name },
        },
      ];
    },
  });
}
