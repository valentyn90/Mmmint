# React Client Template

This  project implements a react client with a node.js/express server.

#### Development Mode

The below instructions are to run the app in a turnkey dev-mode fashion completely inside the provided docker container. We recommend this approach so the node modules match the version running inside the container:

```
# Use nvm to install and use node v16:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v16
nvm use v16

# install the node modules
npm install yarn -g
yarn install

# start the app in dev mode
PORT=3001 npm run dev
```

You can compile light/dark themes from the src/themes less files with the below command:
```
yarn run theme
```

Navigating to http://localhost:3001 will display the dev app.
