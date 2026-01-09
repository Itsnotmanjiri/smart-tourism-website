// Minimal edge function for tourism platform
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Health check
  if (url.pathname === "/make-server-95da31c9/health") {
    return new Response(
      JSON.stringify({ status: "ok", message: "Tourism Platform API" }),
      { headers }
    );
  }

  // Test endpoint
  if (url.pathname === "/make-server-95da31c9/test") {
    return new Response(
      JSON.stringify({ success: true, message: "Edge function is working!" }),
      { headers }
    );
  }

  // Default 404
  return new Response(
    JSON.stringify({ error: "Not found" }),
    { status: 404, headers }
  );
});
