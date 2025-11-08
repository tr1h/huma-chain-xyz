#!/bin/bash
# Start PHP server with PORT from environment variable
PORT=${PORT:-8080}

# Use PHP Development Server (stable and working)
echo "🚀 Starting PHP Development Server on port ${PORT}..."
php -S 0.0.0.0:${PORT} -t . api/tama_supabase.php

