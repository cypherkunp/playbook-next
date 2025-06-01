import { exec, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { exit } from 'process';

const handleformatString =(input)=>{

  if (input.includes('-')) {
   const words = input.split('-');
   for (let i = 1; i < words.length; i++) {
     words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
   }
   return words.join('');
 }
 return input;
}

// Function to check if a micro app is already installed
function isInstalled(microAppNodeModulesPath) {
  try {
    require.resolve(microAppNodeModulesPath);
    return true;
  } catch (error) {
    return false;
  }
}

const promptForExistingWorkSpaces = [

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
  },
]

/*
Template that need to be update or add new  template
*/

function plopfileExistingWS(plop, repoInfo) {

  const WsInfo = {
    workspaceName: repoInfo.workspace,
    microAppName: repoInfo.apps[1].name,
    appNamePort: repoInfo.apps[0].port,
    appName: repoInfo.apps[0].name,
    nextport: repoInfo.nextport,
    otherMicroApp: repoInfo.apps.filter((item, index) => index > 1)
  }
 
  plop.setHelper('calculatePort', function (index) {
    return WsInfo.nextport + index
  });


  plop.setGenerator('app', {
    description: 'Generate a micro apps in existing Work spaces',
    prompts: promptForExistingWorkSpaces,

    actions: (answers) => {
      if (!answers.addMicroApps) {
        exit()
      }
      const dirPath = process.cwd();
      const actions = [
        {
          type: "append",
          path: `${dirPath}/apps/${WsInfo.appName}/next.config.js`,
          pattern: `/* PLOP_INJECT_NEWMICROAPP_CONFIG */`,
          templateFile: 'templates/addMicroAppConfigInContainer.hbs',
          unique: false,
          data: {
            microAppNames: answers.microAppNames || undefined,
          },
        },
      ];

      if (answers.addMicroApps) {
        const microAppNames = answers.microAppNames
          .split(',')
          .map((name) => name.trim());
        microAppNames.forEach((microAppName, index) => {
          actions.push(
            {
              type: 'add',
              path: `${dirPath}/apps/${WsInfo.appName}/src/pages/${microAppName}.tsx`,
              templateFile: 'templates/remoteAppTemplate.hbs',
              data: { microAppTitle: microAppName },
            },
            {
              type: 'append',
              path: `${dirPath}/apps/${WsInfo.appName}/src/tsremote_declarations.ts`,
              templateFile: 'templates/tsDecleration.hbs',
              data: {
                additionalMicroPath: `${handleformatString(microAppName)}/page`,

              },
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/tsremote_declarations.ts`,
              templateFile: 'templates/tsDecleration.hbs',
              data: {
                path: `${handleformatString(WsInfo.microAppName)}/page`,
                storePath: `${handleformatString(WsInfo.microAppName)}/counterStore`,
                additionalMicroPath: `${handleformatString(microAppName)}/page`,
              }

            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/package.json`,
              templateFile: 'templates/microAppPackageJsonTemplate.hbs',
              data: {
                appNameWS: microAppName,
                port: WsInfo.nextport + index,
              },
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/pages/index.tsx`,
              templateFile: 'templates/microAppTemplateInExistingWorkSpace.hbs',
              data: {
                name: microAppName,
                isAdditional: true,
                firstMicroApp: WsInfo.microAppName,
                existingMicroApp: WsInfo.otherMicroApp || undefined,
                appNameWS: WsInfo.appName,
              },
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/pages/_app.tsx`,
              templateFile: 'templates/appTemplate.hbs',
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/pages/_document.tsx`,
              templateFile: 'templates/documentTemplate.hbs',
            },

            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/next.config.js`,
              templateFile: 'templates/microAppNextConfig.hbs',
              data: { applicationName: microAppName, firstMicroApp: WsInfo.microAppName, mapStore: false },
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/next-env.d.ts`,
              templateFile: 'templates/nextEnvTemplate.hbs',
              data: { microAppName: microAppName },
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/pages/_error.tsx`,
              templateFile: 'templates/errorTemplate.hbs',
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/pages/styles.css`,
              templateFile: 'templates/styles.hbs',
              data: {
                appNameWS: WsInfo.appName,
              },
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/tests/app.spec.tsx`,
              templateFile: 'templates/_appTest.hbs'
            },
            // {
            //   type: 'add',
            //   path: `${dirPath}/apps/${microAppName}/src/tests/document.spec.tsx`,
            //   templateFile: 'templates/_documentTest.hbs'
            // },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/tests/error.spec.tsx`,
              templateFile: 'templates/_errorTest.hbs'
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/src/tests/index.spec.tsx`,
              templateFile: 'templates/_indexTest.hbs',
              data: {
                updatedAppName: handleformatString(microAppName),
                microAppName: WsInfo.microAppName
               }
            },
            {
              type: 'add',
              path: `${dirPath}/apps/${microAppName}/tsconfig.json`,
              templateFile: 'templates/microAppTSConfig.hbs'
            }
          );
        });
      }
      actions.push(
        {
          type: 'append',
          path: `${dirPath}/apps/${WsInfo.appName}/src/pages/index.tsx`,
          pattern: `{/* INSERT_DEFAULT_LINK_WHEN_ADD_MICRO_APP */}`,
          template: "{{#if microAppNames}}{{#each (split microAppNames ',')}}&nbsp;<Link href='/{{this}}'>{{this}}</Link>&nbsp; |{{/each}}{{/if}}",
          data: {
            microAppNames: answers.microAppNames
          },
        },
        {
          type: 'append',
          path: `${dirPath}/apps/${WsInfo.microAppName}/src/pages/index.tsx`,
          pattern: `{/* INSERT_DEFAULT_LINK_WHEN_ADD_MICRO_APP */}`,
          template: "{{#if microAppNames}}{{#each (split microAppNames ',')}}&nbsp;<Link href='/{{this}}'>{{this}}</Link>&nbsp; |{{/each}}{{/if}}",
          data: {
            microAppNames: answers.microAppNames
          }
        }
        


      )


      WsInfo.otherMicroApp.forEach((microapp) => {
        actions.push(
          {
            type: 'append',
            path: `${dirPath}/apps/${microapp.name}/src/pages/index.tsx`,
            pattern: `{/* INSERT_DEFAULT_LINK_WHEN_ADD_MICRO_APP */}`,
            template: "{{#if microAppNames}}{{#each (split microAppNames ',')}}&nbsp;<Link href='/{{this}}'>{{this}}</Link>&nbsp; |{{/each}}{{/if}}",
            data: {
              microAppNames: answers.microAppNames
            }
          }
        )

      })
      // updating registry file
      actions.push(function (data) {
        const microAppNames = data.microAppNames
          .split(',')
          .map((name) => name.trim());

        microAppNames.forEach((microAppName, index) => {
          repoInfo.apps.push(
            {
              "name": `${microAppName}`,
              "port": repoInfo.nextport + index,
              "type": "micro-app"
            },
          )
        })

        repoInfo.nextport = repoInfo.apps[repoInfo.apps.length - 1].port + 1
        const workspaceFilePath = path.join(process.cwd(), 'app-registry.json');

        try {
          fs.writeFileSync(workspaceFilePath, JSON.stringify(repoInfo, null, 2), "utf8");
        } catch (error) {
          console.log("An error has occurred ", error);
        }
      });


      actions.push(
        // Run npm install within the root directory and then within the micro app directory
        function (data) {
          const additionalMicroAppNames = data.microAppNames
            ? data.microAppNames.split(',').map((name) => name.trim())
            : [];

          const commands = [];
          additionalMicroAppNames.forEach((aMicroAppName) => {
            const aMicroAppNamePath = path.join(process.cwd(), 'apps', aMicroAppName);
            const microAppNodeModulesPath = path.join(
              process.cwd(),
              'node_modules',
              aMicroAppNamePath
            );

            // Check if the micro app is already installed
            if (!isInstalled(microAppNodeModulesPath)) {
              commands.push(`cd ${aMicroAppNamePath} && npm install`);
            }
          });


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
        console.log('\n|*|*|*| to build run: npm run build');
        console.log(`\n|*|*|*| to run it locally run: npm run dev and access on http://localhost:${WsInfo.appNamePort} & enjoy!!`);
      })

      return actions;


    },
  });
}

export default plopfileExistingWS;