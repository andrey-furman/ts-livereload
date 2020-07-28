const http = require("http");
const cluster = require("cluster");
const { start } = require("./cluster");
const numCPUs = require("os").cpus().length;
const clusterMap = new Map();

console.log('hola')
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const workerId = i + 100;
    const worker = cluster.fork({ workerId });
    clusterMap.set(worker.id, workerId);
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // (workers can works via http web-sockets, etc)
  // We have an HTTP server
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello from Worker ${process.pid}`);
  });

  server.listen(8000);
}
