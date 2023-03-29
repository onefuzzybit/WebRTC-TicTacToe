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
**Using vscode tasks**   
There's a vscode task in place that starts up a watch on all 4 components. To run it, hit ctrl+shift+p -> `Tasks: Run Task` -> `Run Watch Terminals`   
```
**Note** When you run the watch terminals all project try to build at once. Since there are dependencies between the components, some of them will fail due to the dependency not being built yet. If that happens - simply ctrl+c the failing component terminal, and run the `Run Watch Terminals` task again.
```

**Building manually**  
The root folder of the project includes a package.json file with 'workspaces' defined for supporting dependencies. This means that the dependant packages can find the dependencies in node_modules even without installing them. So the first thing to do is run `npm install` on the root folder.

Then cd to the folders in the following order and build them. Run each command from the root of the project:
1. signalling-connect: `cd signalling-connect && npm install && npm run build`
2. signalling-client: `cd signalling-client && npm install && npm run build`
3. signalling-server: `cd signalling-server && npm install && npm run watch` // builds and watches the server - keep it up
4. tic-tac-toe: `cd tic-tac-toe-ms1 && npm start` // builds and watches the app

**Running the game**  
The default application port is `5173`, so once everything is built, all you need to do is open 2 browser tabs, and point both to localhost:5173. When you do, wait for the first browser to display the status message 'Waiting for opponent' before opening the second browser window.