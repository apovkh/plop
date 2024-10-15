export default function (plop) {
  const moduleDirectories = ['moduleA', 'moduleB', 'moduleC'];

  plop.setGenerator('module', {
    description: 'Generate a module for Vue component with selected features',
    prompts: [
      {
        type: 'autocomplete',
        name: 'module',
        message: 'Select the module directory:',
        source: (_, input) => {
          input = input || '';
          return new Promise((resolve) => {
            const filteredModules = moduleDirectories.filter(module =>
              module.toLowerCase().includes(input.toLowerCase())
            );
            resolve(filteredModules);
          });
        },
        validate: (value) => (value ? true : 'Module selection is required.')
      },
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
        validate: (value) => value ? true : 'Component name must be in PascalCase.'
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
          return `You are about to generate the following files in module: ${plop.getHelper('pascalCase')(answers.module)}/src/ui/components/${answers.folder || ''}\n
          Component: ${plop.getHelper('pascalCase')(answers.name)}.vue\n
          Features: ${featuresList}\n
          Do you want to proceed?`;
        },
      },
    ],
    actions: (data) => {
      if (!data.confirmCreation) {
        return [];
      }

      const name = '{{pascalCase name}}';
      const moduleName = '{{pascalCase module}}';
      const componentFolder = `modules/${moduleName}/src/ui/components/${name}`;

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
            watch: data.features.includes('watch')
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
        }
      ];
    },
  });
}
