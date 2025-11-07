#!/bin/bash
# Start PHP server with PORT from environment variable
PORT=${PORT:-8080}
php -S 0.0.0.0:${PORT} -t . api/tama_supabase.php

