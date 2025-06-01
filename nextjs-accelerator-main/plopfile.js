import { exec, execSync } from 'child_process';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import plopfileExistingWS from './plopfileExistingWS.js'



let __dirname = dirname(fileURLToPath(import.meta.url));

const handleformatString = (input) => {
  if (input && input.includes('-')) {
    const words = input.split('-');
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join('');
  }
  return input;
}


Handlebars.registerHelper('formatString', function (input) {
  return handleformatString(input)
});
Handlebars.registerHelper('split', function (str, separator) {
  return str.split(separator);
});

Handlebars.registerHelper('portCounter', function (index, remotePortNumber) {

  return remotePortNumber + 1 + index
});
Handlebars.registerHelper('defaultNextPort', function (remotePortNumber) {
  return remotePortNumber + 1
});

Handlebars.registerHelper('microNameCounter', function (name) {
  return name + 1
});

Handlebars.registerHelper('add', function (a, b) {
  return a + b
});

Handlebars.registerHelper('calculateNextPort', function (str, remotePortNumber) {
  const splitString = str.split(',')
  return (Array.isArray(splitString) ? splitString.length : 0) + remotePortNumber + 1
});

Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

// Function to check if a micro app is already installed
function isInstalled(microAppNodeModulesPath) {
  try {
    require.resolve(microAppNodeModulesPath);
    return true;
  } catch (error) {
    return false;
  }
}

function checkExistingWorkspace() {
  const workspaceFilePath = path.join(process.cwd(), 'app-registry.json');
  return fs.existsSync(workspaceFilePath);
}
function getFileContent() {
  try {
    const workspaceFilePath = path.join(process.cwd(), 'app-registry.json');
    const fileContent = fs.readFileSync(workspaceFilePath, 'utf-8');
    return fileContent;
  } catch (err) {
    console.error('Error reading file:', err.message);
  }
}


function plopRun(plop) {

  const isExistingWS = checkExistingWorkspace()
  if (isExistingWS) {
    const repoInfo = getFileContent()
    const repoJsonParse = JSON.parse(repoInfo);
    plopfileExistingWS(plop, repoJsonParse)
  }
  else {
    plop.setHelper('calculatePort', function (index, portNumber) {
      return parseInt(portNumber) + 2 + index;
    });
    plop.setGenerator('app', {
      description: 'Generate a container app with micro apps',


      prompts: [
        {
          type: 'input',
          name: 'workspaceName',
          message: 'Enter the name of your Turbo workspace:',
          default: 'my-nextjs-project',
        },
        {
          type: 'input',
          name: 'appName',
          message: 'Enter the name of the (host) micro app:',
          default: 'Container',
          validate: function (value) {
            if (/^\d+$/.test(value)) {
              return "Sorry, names cannot consist solely of digits. Please enter a valid name.";
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'microAppName',
          message: 'Enter the name of the first (remote) micro app:',
          default: 'Remoteapp',
          validate: function (value) {
            if (/^\d+$/.test(value)) {
              return "Sorry, names cannot consist solely of digits. Please enter a valid name.";
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'portNumber',
          message: 'Enter port number on which do you  want  to run application',
          default: 3000,
        },
        {
          type: 'confirm',
          name: 'addMicroApps',
          message: 'Do you want to add more (remote) micro apps?',
        },
        {
          type: 'input',
          name: 'microAppNames',
          message: 'Enter the name(s) of micro (remote) apps separated by comma:',
          when: (answers) => answers.addMicroApps,
          validate: function (value) {
            const microAppNames = value
              .split(',')
              .map((name) => name.trim());

            const inValidAppName = microAppNames.find((microAppName) => {
              return /^\d+$/.test(microAppName)
            })
            if (inValidAppName && inValidAppName.length > 0) {
              return "Sorry, names cannot consist solely of digits. Please enter a valid name.";
            }
            return true;
          }
        }
      ],

      actions: (answers) => {
        const actions = [
          {
            type: 'add',
            path: '{{workspaceName}}/turbo.json',
            templateFile: 'templates/turboConfigTemplate.hbs',
            data: {
              workspaceName: '{{workspaceName}}',
              microAppName: '{{microAppName}}',
              appName: '{{appName}}',
              microAppNames: '{{microAppNames}}',
            },
          },

          {
            type: 'add',
            path: '{{workspaceName}}/package.json',
            templateFile: 'templates/rootPackageJsonTemplate.hbs',
            data: {
              workspaceName: '{{workspaceName}}',
              microAppName: '{{microAppName}}',
              appName: '{{appName}}',
              microAppNames: '{{microAppNames}}',
            },
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/{{appName}}/src/pages/index.tsx`,
            templateFile: 'templates/containerAppTemplate.hbs',
            data: {
              microAppName: '{{microAppName}}',
              appName: '{{appName}}',
              microAppNames: answers.microAppNames || undefined,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/src/pages/layout.tsx',
            templateFile: 'templates/layoutTemplate.hbs',
            data: {
              appNameWS: answers.appName,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/src/pages/styles.css',
            templateFile: 'templates/styles.hbs',
            data: {
              appNameWS: answers.appName,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/src/tsremote_declarations.ts',
            templateFile: 'templates/tsDecleration.hbs',
            data: {
              path: `${handleformatString(answers.microAppName)}/page`,
              storePath: `${handleformatString(answers.microAppName)}/counterStore`,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/src/pages/_app.tsx',
            templateFile: 'templates/appTemplate.hbs',
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/src/pages/_error.tsx',
            templateFile: 'templates/errorTemplate.hbs',
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/src/pages/_document.tsx',
            templateFile: 'templates/documentTemplate.hbs',
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/{{appName}}/src/pages/${answers.microAppName}.tsx`,
            templateFile: 'templates/remoteAppTemplate.hbs',
            data: { microAppTitle: answers.microAppName },
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/${answers.microAppName}/src/pages/styles.css`,
            templateFile: 'templates/styles.hbs',
            data: {
              appNameWS: answers.appName,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/package.json',
            templateFile: 'templates/microAppPackageJsonTemplate.hbs', // Use the same template file
            data: {
              appNameWS: answers.appName,
              port: parseInt(answers.portNumber),
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/next.config.js',
            templateFile: 'templates/containerAppNextConfig.hbs',
            data: {
              appName: '{{appName}}',
              microAppPort: parseInt(answers.portNumber) + 1,
              containerPort: parseInt(answers.portNumber),
              microAppNames: answers.microAppNames || undefined,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{appName}}/next-env.d.ts',
            templateFile: 'templates/nextEnvTemplate.hbs',
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/${answers.microAppName}/src/pages/index.tsx`,
            templateFile: 'templates/microAppTemplate.hbs',
            data: {
              name: answers.microAppName,
              firstMicroApp: answers.microAppName,
              isAdditional: false,
              appNameWS: answers.appName,
            },
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/${answers.microAppName}/src/store/counterStore.ts`,
            templateFile: 'templates/storeTemplate.hbs',
          },

          {
            type: 'add',
            path: `{{workspaceName}}/apps/${answers.microAppName}/src/pages/_app.tsx`,
            templateFile: 'templates/appTemplate.hbs',
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/${answers.microAppName}/src/pages/_error.tsx`,
            templateFile: 'templates/errorTemplate.hbs',
          },
          {
            type: 'add',
            path: `{{workspaceName}}/apps/${answers.microAppName}/src/pages/_document.tsx`,
            templateFile: 'templates/documentTemplate.hbs',
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{microAppName}}/next.config.js',
            templateFile: 'templates/microAppNextConfig.hbs',
            data: { applicationName: answers.microAppName, firstMicroApp: answers.microAppName, mapStore: true, firstMicroAppPort: parseInt(answers.portNumber) + 1 },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{microAppName}}/package.json',
            templateFile: 'templates/microAppPackageJsonTemplate.hbs', // Use the same template file
            data: {
              appNameWS: answers.microAppName,
              port: parseInt(answers.portNumber) + 1,
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/apps/{{microAppName}}/next-env.d.ts',
            templateFile: 'templates/nextEnvTemplate.hbs',
          },
          {
            type: 'add',
            path: '{{workspaceName}}/app-registry.json',
            templateFile: 'templates/registryJson.hbs',
            data: {
              workspaceName: '{{workspaceName}}',
              microAppName: '{{microAppName}}',
              appName: '{{appName}}',
              microAppNames: answers.microAppNames || undefined,
              containerPortNumber: parseInt(answers.portNumber),
              remotePortNumber: parseInt(answers.portNumber) + 1
            },
          },
          {
            type: 'add',
            path: '{{workspaceName}}/babel.config.cjs',
            templateFile: 'templates/babelConfig.hbs',
          },
          {
            type: 'add',
            path: '{{workspaceName}}/jest.config.js',
            templateFile: 'templates/jestConfig.hbs',
          },
          //append test files to each individual micro app
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.appName}/src/tests/app.spec.tsx`,
            templateFile: 'templates/_appTest.hbs'
          },
          // {
          //   type: 'add',
          //   path: `${answers.workspaceName}/apps/${answers.appName}/src/tests/document.spec.tsx`,
          //   templateFile: 'templates/_documentTest.hbs'
          // },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.appName}/src/tests/error.spec.tsx`,
            templateFile: 'templates/_errorTest.hbs'
          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.appName}/src/tests/layout.spec.tsx`,
            templateFile: 'templates/_layoutTest.hbs',
            data: {
              updatedAppName: handleformatString(answers.appName)
             }
          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.appName}/src/tests/index.spec.tsx`,
            templateFile: 'templates/_indexTest.hbs',
            data: {
              updatedAppName: handleformatString(answers.appName)
            }

          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.appName}/tsconfig.json`,
            templateFile: 'templates/microAppTSConfig.hbs'
          },
          //append test files for each remote app
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.microAppName}/src/tests/app.spec.tsx`,
            templateFile: 'templates/_appTest.hbs'
          },
          // {
          //   type: 'add',
          //   path: `${answers.workspaceName}/apps/${answers.microAppName}/src/tests/document.spec.tsx`,
          //   templateFile: 'templates/_documentTest.hbs'
          // },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.microAppName}/src/tests/error.spec.tsx`,
            templateFile: 'templates/_errorTest.hbs'
          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.microAppName}/src/tests/index.spec.tsx`,
            templateFile: 'templates/_indexTest.hbs',
            data: {
              updatedAppName: handleformatString(answers.microAppName)
            }
          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.microAppName}/src/store/store.spec.tsx`,
            templateFile: 'templates/_storeTest.hbs'
          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.microAppName}/tsconfig.json`,
            templateFile: 'templates/microAppTSConfig.hbs'
          },
          {
            type: 'add',
            path: `${answers.workspaceName}/apps/${answers.microAppName}/src/tsremote_declarations.ts`,
            templateFile: 'templates/tsDecleration.hbs',
            data: {
              path: `${handleformatString(answers.microAppName)}/page`,
              storePath: `${handleformatString(answers.microAppName)}/counterStore`,
              additionalMicroPath: `${handleformatString(answers.microAppName)}/page`,
            }
          },

        ];

        if (answers.addMicroApps) {
          const microAppNames = answers.microAppNames
            .split(',')
            .map((name) => name.trim());
          microAppNames.forEach((microAppName, index) => {
            const port = index + 1;
            actions.push(
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${answers.appName}/src/pages/${microAppName}.tsx`,
                templateFile: 'templates/remoteAppTemplate.hbs',
                data: { microAppTitle: microAppName },
              },
              {
                type: 'append',
                path: `{{workspaceName}}/apps/${answers.appName}/src/tsremote_declarations.ts`,
                templateFile: 'templates/tsDecleration.hbs',
                data: {
                  additionalMicroPath: `${handleformatString(microAppName)}/page`,

                },
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/src/tsremote_declarations.ts`,
                templateFile: 'templates/tsDecleration.hbs',
                data: {
                  path: `${handleformatString(answers.microAppName)}/page`,
                  storePath: `${handleformatString(answers.microAppName)}/counterStore`,
                  additionalMicroPath: `${handleformatString(microAppName)}/page`,
                }

              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/package.json`,
                templateFile: 'templates/microAppPackageJsonTemplate.hbs',
                data: {
                  appNameWS: microAppName,
                  port: parseInt(answers.portNumber) + 1 + port,
                },
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/src/pages/index.tsx`,
                templateFile: 'templates/microAppTemplate.hbs',
                data: {
                  name: microAppName,
                  isAdditional: true,
                  firstMicroApp: answers.microAppName,
                  appNameWS: answers.appName,
                },
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/src/pages/_app.tsx`,
                templateFile: 'templates/appTemplate.hbs',
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/src/pages/_document.tsx`,
                templateFile: 'templates/documentTemplate.hbs',
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/next.config.js`,
                templateFile: 'templates/microAppNextConfig.hbs',
                data: { applicationName: microAppName, firstMicroApp: answers.microAppName, mapStore: false, firstMicroAppPort: parseInt(answers.portNumber) + 1 },
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/next-env.d.ts`,
                templateFile: 'templates/nextEnvTemplate.hbs',
                data: { microAppName: microAppName },
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/src/pages/_error.tsx`,
                templateFile: 'templates/errorTemplate.hbs',
              },
              {
                type: 'add',
                path: `{{workspaceName}}/apps/${microAppName}/src/pages/styles.css`,
                templateFile: 'templates/styles.hbs',
                data: {
                  appNameWS: answers.appName,
                },
              },
              {
                type: 'add',
                path: `${answers.workspaceName}/apps/${microAppName}/src/tests/app.spec.tsx`,
                templateFile: 'templates/_appTest.hbs'
              },
              // {
              //   type: 'add',
              //   path: `${answers.workspaceName}/apps/${microAppName}/src/tests/document.spec.tsx`,
              //   templateFile: 'templates/_documentTest.hbs'
              // },
              {
                type: 'add',
                path: `${answers.workspaceName}/apps/${microAppName}/src/tests/error.spec.tsx`,
                templateFile: 'templates/_errorTest.hbs'
              },
              {
                type: 'add',
                path: `${answers.workspaceName}/apps/${microAppName}/src/tests/index.spec.tsx`,
                templateFile: 'templates/_indexTest.hbs',
                data: {
                  updatedAppName: handleformatString(answers.microAppName),
                 }
              },
              {
                type: 'add',
                path: `${answers.workspaceName}/apps/${microAppName}/tsconfig.json`,
                templateFile: 'templates/microAppTSConfig.hbs'
              }
            );
          });
        }
        actions.push(
          // Run npm install within the root directory and then within the micro app directory
          function (data) {
            __dirname = process.cwd();

            const workspacePath = path.join(__dirname, data.workspaceName); // Update to your actual path

            const hostAppPath = path.join(workspacePath, 'apps', data.appName);

            const microAppPath = path.join(
              workspacePath,
              'apps',
              data.microAppName
            );
            const additionalMicroAppNames = data.microAppNames
              ? data.microAppNames.split(',').map((name) => name.trim())
              : [];
            const commands = [
              `cd ${workspacePath} && npm install`,
              `cd ${hostAppPath} && npm install`,
              `cd ${microAppPath} && npm install`,
            ];

            additionalMicroAppNames.forEach((aMicroAppName) => {
              const aMicroAppNamePath = path.join(workspacePath, 'apps', aMicroAppName);
              const microAppNodeModulesPath = path.join(
                workspacePath,
                'node_modules',
                aMicroAppNamePath
              );

              // Check if the micro app is already installed
              if (!isInstalled(microAppNodeModulesPath)) {
                commands.push(`cd ${aMicroAppNamePath} && npm install`);
              }
            });
            console.log('\n|*|*|*| Installing dependencies for workspace, container and remote(s), might take few minutes...');

            commands.forEach((command) => {
              console.log('\n|*|*|*| Running... ', command);
              execSync(command, (err) => {
                if (err) {
                  console.error('Error:', err);
                } else {
                  console.log(`\n|*|*|*| Installed dependencies successfully: ${command}`);
                }
              });
            });
          }
        );

        actions.push(function (data) {
          console.log('\n|*|*|*| App is ready for use now, next build and run the app');
          console.log('\n|*|*|*| change into your workspace cd ', data.workspaceName);
          console.log('\n|*|*|*| to build run: npm run build');
          console.log(`\n|*|*|*| to run it locally run: npm run dev and access on http://localhost:${data.portNumber} & enjoy!!`);
        })

        return actions;


      },
    });
  }



}

export default plopRun;