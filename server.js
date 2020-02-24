require("dotenv").config();
var app = require("express")();
var http = require("http").createServer(app);
var cors = require("cors");
var NodeTree = require('./server/NodeTree');
// var io = require('socket.io')(http);
var GameServer = require("./server/game-server");

app.use(cors());
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

const Game = new GameServer(io);
new NodeTree(300, 300).generateTree();

io.on("connection", socket => {
  var addedUser = false;
  // Connecting users
  socket.on("add user", username => {
    if (addedUser) return; // idempotent
    console.log(`adding user ${username} (users were ${JSON.stringify(Game.getUserList())})`);
    // check for uniqueness
    if (Game.getUserList().filter(user => user.username === username).length !== 0) return;
    socket.username = username;
    const newUserId = Game.addUser(socket.username);
    socket.userId = newUserId;
    console.log('returned ID:' + newUserId)
    

    // socket.emit("userlist", { users: Game.getUserList() });
    // socket.broadcast.emit("user joined", {
    //   username: socket.username,
    //   users: Game.getUserList()
    // });
    addedUser = true;
  });

  socket.on("angle move", (move, username) => {
      // console.log(
      // `user chose to move ${JSON.stringify(move)}, by user: ${JSON.stringify(
      //   username
      // )}`
      //);
    Game.setUserRotation(username, move);
  });

  socket.on("power move", (move, username) => {
    Game.setUserMagnitude(username, move);
  });

  socket.on("disconnect user", username => {
    Game.removeUser(socket.userId);
    console.log(
      `removed user ${username} with id ${
        socket.userId
      } (users are ${JSON.stringify(Game.getUserList())})`
    );
  });


});


// RESTFUL Endpoints
app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});

// Game start
app.post("/reset", function(req, res) {
  Game.resetStart();
});

app.post("/start", function(req, res) {
  Game.startRoundCountdown();
  
});

http.listen(process.env.SERVER_PORT, function() {
  console.log(`listening on ${process.env.SERVER_PORT}`);
});
