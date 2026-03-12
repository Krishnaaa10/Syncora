const { io } = require("socket.io-client");
const http = require("http");

console.log("Starting verification...");

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to socket server. Socket ID:", socket.id);
  
  // Create an order after connecting
  const postData = JSON.stringify({
    items: [{ id: "MNR01_ITM001", quantity: 1 }],
    type: "delivery",
    userId: "test_user",
    store_id: "MNR01"
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log("Order POST status:", res.statusCode);
  });

  req.on('error', (e) => {
    console.error("Order POST error:", e);
  });

  req.write(postData);
  req.end();
});

socket.on("newOrder", (order) => {
  console.log("SUCCESS: Received 'newOrder' event!");
  console.log("Order ID:", order.orderId);
  console.log("Store ID:", order.store_id);
  
  socket.disconnect();
  process.exit(0);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error("FAILURE: Did not receive 'newOrder' event in time.");
  process.exit(1);
}, 10000);
