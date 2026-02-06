// This file is the entry point for the Convex backend
// It exports the schema and any HTTP actions

import { httpRouter } from "convex/server";

const http = httpRouter();

// Add HTTP actions here if needed
// http.route({
//   path: "/webhook",
//   method: "POST",
//   handler: async (ctx, request) => {
//     // Handle webhook
//   },
// });

export default http;