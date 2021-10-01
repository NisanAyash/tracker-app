const express = require("express");
const cors = require("cors");
const redis = require("redis");
const PORT = 5000;
const { promisify } = require("util");

const app = express();

const redisClient = redis.createClient({
  host: "redis-server",
  port: 6379,
});

const getRedis = promisify(redisClient.get).bind(redisClient);

app.use(cors());

app.get("/", (req, res) => {
  res.send("festival tracker app works!");
});

app.get("/api/v1/traffic", async (req, res) => {
  const visitors = await getRedis("visitors");

  if (!visitors) {
    redisClient.set("visitors", 0);
    return res.send("initialized");
  }

  // Async function
  redisClient.set("visitors", +visitors + 1);

  return res.send(visitors);
});

app.get("/api/v1/status", async (req, res) => {
  const visitors = await getRedis("visitors");
  res.json({ visitors });
});

app.listen(PORT, () => console.log("App running on port " + PORT));
