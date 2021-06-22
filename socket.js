let io;
module.exports = {
  init: httpServer => {
   return io = require("socket.io")(httpServer);

  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket Not Initialized");
    } else {

      return io;
    }
  }
};
