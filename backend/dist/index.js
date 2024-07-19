"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono"); // To use hono framework
const pretty_json_1 = require("hono/pretty-json"); // To work with JSON
const authRoutes_1 = __importDefault(require("./authRoutes"));
const node_server_1 = require("@hono/node-server"); // To start server
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = require("hono/cors");
dotenv_1.default.config();
// Create a new Hono instance
const app = new hono_1.Hono();
// Middleware
app.use("*", (0, pretty_json_1.prettyJSON)());
const corsOption = {
    origin: ["http://localhost:5173"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["*"],
};
app.use((0, cors_1.cors)(corsOption));
// Root route
app.get("/", (c) => {
    return c.html("<h1>Hello OCG!</h1>");
});
// CORS configuration for specific routes
// Routes
app.route("/auth", authRoutes_1.default);
// Get port number from environment variable or use default (5000)
const port = Number(process.env.PORT) || 5000;
// Start the server
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: port,
});
console.log(`Server running on http://localhost:${port}`);
