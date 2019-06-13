const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const uuidv4 = require('uuid/v1');

// const clients =[];

const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));
// Create the WebSockets server
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  // clients.push(ws);
  const seconds = Date.now();
  const timestamp = new Date(seconds);
  console.log(`Client connected to Chatty Server at ${timestamp}`);
  logOn();

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
        console.log("The broadcast was sent to all connected to ChattyApp")
      }
    });
  };  

  ws.on('message', function incoming(message) {
    const newMessage = JSON.parse(message);
    let { username, content } = newMessage;
    newMessage.id = uuidv4();
    console.log(`User ${username} said ${content} refID: ${newMessage.id}`);
      wss.broadcast(newMessage);
      if (message.type === 'incomingNotification') {
        let notificationMessage = {content}
        wss.broadcast(JSON.stringify(notificationMessage));
      }
  });
  
// Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {;
  // clients.pop();
  console.log(`Client has left - Total connections ${clients.length}`); 
  logOn();
  });
});

//Function to send usercount to clients
function logOn() {
  let output = {
    type: 'usercount',
    content: wss.clients.size
  }
  wss.clients.forEach(client => {
    client.send(JSON.stringify(output));
  });
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
