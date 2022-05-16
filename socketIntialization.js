let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
        methods: "*",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket is not intialized");
    }
    return io;
  },
};
