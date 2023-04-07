# WebRTC-TicTacToe

This repo is a work-in-progress that aims to develop webRTC based game infrastructure - so that minimum server interaction would be needed. The goal is to be able to develop full peer 2 peer games easily.

In this stage of development, there's a single working game (tic-tac-toe) - only on localhost
Read about the development process at https://www.one-fuzzy-bit.com/post/planning-a-webrtc-based-multiplayer-game and consecutive posts.

The current state is partial implementation of milestone 1 of the project.

## Project structure

The project is built as a monorepo with 4 components (folders):

1. signalling-connect - a type library to share types and message code between the signalling client and signalling server. Uses signalling-connect.
2. signalling-server - websocket server which functions as a bootstrap node for new players - connecting them to other players.
3. signalling-client - a browser side library that communicates with the signalling server to handle the connection
4. tic-tac-toe-ms1 - React app that implements the peer-2-peer tic-tac-toe game over a connection handler. It uses the signalling-client to connect to the signalling-server and pass messages to peer.

## Building and running the project.

The root folder of the project includes a package.json file with 'workspaces' defined to let npm know about all the projects in the repo. This means that the dependant packages can find the dependencies in node_modules even without installing them, and that npm automatically installs dependencies for all projects. So the first thing to do is run `npm install` on the root folder.

**Using vscode tasks**  
There's a vscode task in place that starts up a watch on the projects and dependencies. To run it, hit ctrl+shift+p -> `Tasks: Run Task` -> `Run Watch Terminals`

```
**Note** When you run the watch terminals the server project often loads before the dependency (signalling-connect) finishes building. In this case there will be an error message, but a few seconds later (when the dependency will finish building) the server will restart and load successfully.
```

**Building manually**  
Open 3 terminals, cd into the relevant projects, and run the appropriate npm install command. It's best to do this in order:

1. signalling-connect: `cd signalling-connect && npm run watch-connect`
2. signalling-server: `cd signalling-server && npm run watch-server`
3. tic-tac-toe: `cd tic-tac-toe-ms1 && npm start` // builds and watches the app

We don't need to manually build the `signalling-client` package since it is aliased in the `tic-tac-toe-ms1` vite.config.ts file. So it's built as part of building the game.

We DO need to build the signalling-connect folder, because vite doesn't support server-side code. So we build the library separately for the server, and
the server nodemon configuration listens for changes to the dist folder of the library.

**Running the game**  
The default application port is `5173`, so once everything is built, all you need to do is open 2 browser tabs, and point both to localhost:5173. When you do, wait for the first browser to display the status message 'Waiting for opponent' before opening the second browser window.

## Deployment

The project deploys in 2 parts:

1. The server deploys to a GCP compute engine
2. The client deploys to a GCS bucket

### Deployment assumptions

The repo is written to be maintained by me (one fuzzy bit) - if you intend to replicate it, you would need to update the deployment scripts to use your
resources names:

1. the `gcp-set-account` script assumes my account name
2. the `gcp-set-project` script assumes my gcp project name
3. the `gcp-get-server-ip` script assumes the name i've given to the compute engine running the signalling server code.
4. ssh-ing the server assumes the server added the public key of my local host machine as an authorized key, and the username on that server.
5. Server and package deployment assumes you have configured a valid .npmrc file in your host, which contains a personal access token supporting github package publishing and installing

### Connecting to gcp cloud

1. `npm run gcp-login` and follow the terminal instructions (cli based login to your gcp account)
2. `npm run gcp-set-account` - connects to the defined gcp account
3. `npm run gcp-set-project` - connects to the defined project

### Deploying the server

1. Make sure you're authenticated to GCP, and the proper account and project are configured. (see the [Connecting to gcp cloud](#connecting-to-gcp-cloud) section)
2. `npm run build-server`
3. `npm run deploy-server`

### Deploying the signalling-connect package

1. `cd signalling-connect`
2. `npm publish`

### Deploying the tic-tac-toe-ms1 game

1. Make sure you're authenticated to GCP, and the proper account and project are configured. (see the [Connecting to gcp cloud](#connecting-to-gcp-cloud) section)
2. `npm run build-ms1`
3. `npm deploy-ms1`
