#!/bin/bash
# Start Apache or PHP server with PORT from environment variable
PORT=${PORT:-8080}

# Check if Apache is available (Dockerfile setup)
if command -v apache2 &> /dev/null; then
    echo "✅ Starting Apache (Railway maps \$PORT=${PORT} to container port 80)..."
    # Apache listens on port 80 internally
    # Railway automatically maps $PORT to container port 80
    # Start Apache in foreground
    exec apache2-foreground
else
    echo "⚠️ Apache not found, using PHP Development Server on port ${PORT}..."
    echo "⚠️ WARNING: PHP Development Server is not recommended for production!"
    # Fallback to PHP Development Server (only for local development)
    php -S 0.0.0.0:${PORT} -t . api/tama_supabase.php
fi

