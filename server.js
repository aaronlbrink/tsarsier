require('dotenv').config()
var app = require('express')();
var http = require('http').createServer(app);
// var io = require('socket.io')(http);

const io = require("socket.io")(http, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});
// io.set('origins', 'http://localhost:3001');
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

var users = [];
var last_user_id = 0;

io.on('connection', (socket) => {
  var addedUser = false;

  // Connecting users
  socket.on('add user', (username) => {
    if (addedUser) return; // idempotent
    addedUser = true;
    console.log(`adding user ${username} (users were ${JSON.stringify(users)})`);
    socket.username = username;
    socket.user_id = ++last_user_id;
    users.push({username: socket.username, user_id: socket.user_id});
    socket.emit('userlist', { users: users});
    socket.broadcast.emit('user joined', {
      username: socket.username,
      users: users,
    });
  });

  socket.on('angle move', (move) => {
    console.log(`user chose to move ${JSON.stringify(move)}, by user: ${JSON.stringify(move)}`);
  })

  socket.on('power move', (move) => {
    console.log(`user chose to move ${JSON.stringify(move)}, by user: ${JSON.stringify(move)}`);
  })

  socket.on('disconnect', () => {
    var idx = users.findIndex(d => d.user_id === socket.user_id);
    if (idx >= 0) users.splice(idx, 1);
    console.log(`removed user ${socket.username} with id ${socket.user_id} (users are ${JSON.stringify(users)})`);
  });

  // TODO:
  // Game Round Signals
  // Indicate to clients with connected sockets which turn it is so controllers can make inputs avaliable
  // Rounds:
  //   - 
});

http.listen(process.env.SERVER_PORT, function(){
  console.log(`listening on ${process.env.SERVER_PORT}`);
});
