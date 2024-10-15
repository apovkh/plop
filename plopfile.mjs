export default function (plop) {
  const name = '{{pascalCase name}}'
  const folder = `./src/components/${name}`

  
  plop.setGenerator('component', {
    description: 'Test creation vue component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${folder}/${name}.vue`,
        templateFile: './plop-templates/component.vue.hbs',
      },
      {
        type: 'add',
        path: `${folder}/${name}.spec.ts`,
        templateFile: './plop-templates/unit-test.spec.hbs',
      },
      {
        type: 'add',
        path: `${folder}/index.ts`,
        templateFile: './plop-templates/barel-file.ts.hbs',
      },
      {
        type: 'add',
        path: `${folder}/I${name}Types.ts`,
        templateFile: './plop-templates/component-types.ts.hbs',
      }
    ]
  })
}