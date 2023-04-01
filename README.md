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
