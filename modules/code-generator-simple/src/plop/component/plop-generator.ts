import { Answers } from 'plop';


export const generatorComponent = (plop) => ({
  description: 'Generate a Vue component with selected features',
  prompts: [
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
        return `You are about to generate the following component:\n
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

    const name = '{{pascalCase name}}';
    const componentFolder = `../components/${name}`;

    return [
      {
        type: 'add',
        path: `${componentFolder}/${name}.vue`,
        templateFile: 'src/plop/generators/component/templates/component.vue.hbs',
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
        templateFile: 'src/plop/generators/component/templates/barel-file.ts.hbs',
      },
      {
        type: 'add',
        path: `${componentFolder}/${name}Types.ts`,
        templateFile: 'src/plop/generators/component/templates/types.ts.hbs',
      }
    ];
  },
});

