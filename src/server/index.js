let app = require("express")();
let server = require("http").createServer(app);
let io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("chat message", function(msg) {
    console.log("message: " + JSON.stringify(msg));
    io.emit("chat message", msg);
  });
});

var port = process.env.PORT || 3001;

server.listen(port, function() {
  console.log("listening in http://localhost:" + port);
});
