# Nextjs Module Federator App Generator

This PSInnersource accelerator allows a developer to quickly setup a Nextjs based module federated application setup, using turbo as monorepo workspace.

## Setup & Run locally

Make sure you use nodejs >= 18.17.0

1. In a blank directory , run below command to start using it

```npx @genesisx/nextjs-mfe```

2. It will ask various inputs like workspace name, container application name, remote app(s) name 
 

3. Once setup, go inside the workspace directory (cd workspace) and build the project 

``` npm run build ```

4. Serve the application as : 

```npm run dev ```

5. You can access the application on : http://localhost:3000



## Code Access
Please refer the following repo 

https://pscode.lioncloud.net/psinnersource/xt/micro-frontend/genesisx/nextjs-accelerator


## Need More details
Please reach out to Devesh Kaushal, Lalit Negi

#### Publish to NPM
Step 1 : Build the package npm run build
Step 2 : Go to dist directory 
Step 3 : Run below command
```
npm publish --access public
```

NPM Repo : https://www.npmjs.com/package/@genesisx/nextjs-mfe 

## Node version Support
Node Version >= 18.17.0

## NPM Packages
- next | 14.1.0
- react | 18.2.0
- turbo | 1.10.15
- webpack | 5.80.0
- zustand | 4.4.3
- @module-federation/nextjs-mf | 8.1.10