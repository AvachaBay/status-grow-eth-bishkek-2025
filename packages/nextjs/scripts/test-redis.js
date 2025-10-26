// Test script to verify Upstash Redis connection
require("dotenv").config();
const { Redis } = require("@upstash/redis");

async function testRedisConnection() {
  try {
    console.log("🔄 Testing Upstash Redis connection...");

    // Check if environment variables are set (using your existing .env variables)
    const redisUrl = process.env.KV_REST_API_URL;
    const redisToken = process.env.KV_REST_API_TOKEN;

    if (!redisUrl || !redisToken) {
      console.error("❌ Missing environment variables:");
      console.error("KV_REST_API_URL:", redisUrl ? "✅ Set" : "❌ Missing");
      console.error("KV_REST_API_TOKEN:", redisToken ? "✅ Set" : "❌ Missing");
      return;
    }

    console.log("✅ Environment variables found");
    console.log("🔗 Redis URL:", redisUrl);
    console.log("🔑 Token:", redisToken.substring(0, 10) + "...");

    // Create Redis client
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // Test connection with a simple ping
    console.log("🏓 Pinging Redis...");
    const pong = await redis.ping();
    console.log("✅ Ping response:", pong);

    // Test set/get operations
    console.log("📝 Testing set/get operations...");
    const testKey = "test:connection";
    const testValue = { message: "Hello Upstash!", timestamp: Date.now() };

    await redis.set(testKey, testValue);
    console.log("✅ Set operation successful");

    const retrievedValue = await redis.get(testKey);
    console.log("✅ Get operation successful");
    console.log("📦 Retrieved value:", retrievedValue);

    // Clean up test key
    await redis.del(testKey);
    console.log("🧹 Cleaned up test key");

    console.log("🎉 Upstash Redis connection test successful!");
    console.log("🚀 Your user state management is ready to use!");
  } catch (error) {
    console.error("❌ Redis connection test failed:");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Run the test
testRedisConnection();
