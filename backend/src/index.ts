import { Hono } from "hono"; // To use hono framework
import { prettyJSON } from "hono/pretty-json"; // To work with JSON
import authRoutes from "./authRoutes";
import { serve } from "@hono/node-server"; // To start server
import dotenv from "dotenv";
import { cors } from "hono/cors";

dotenv.config();

// Create a new Hono instance
const app = new Hono();

// Middleware
app.use("*", prettyJSON());
const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["*"],
};
app.use(cors(corsOption));
// Root route
app.get("/", (c) => {
  return c.html("<h1>Hello OCG!</h1>");
});

// CORS configuration for specific routes

// Routes
app.route("/auth", authRoutes);

// Get port number from environment variable or use default (5000)
const port = Number(process.env.PORT) || 5000;

// Start the server
serve({
  fetch: app.fetch,
  port: port,
});

console.log(`Server running on http://localhost:${port}`);
