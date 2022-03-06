const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
// a peer is an address, look like ws://localhost:12345

class P2PServer {
  /**
   *
   * @param {*} blockchain
   * @param {*} transactionPool
   */
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new Websocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("Socket connected");

    this.handleMessage(socket);
    this.sendChain(socket);
  }

  handleMessage(socket) {
    socket.on("message", (message) => {
      const data = JSON.parse(message);
      console.log(data);
      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  // send the updated blockchain instance to all peers
  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }
}

module.exports = P2PServer;
