require("dotenv").config();
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const { API_PORT } = process.env;

const port = process.env.PORT || API_PORT;

//SERVER LISTING.....
server.listen(port, () => {
    console.log(`The App is Running on port ${API_PORT}`);
});