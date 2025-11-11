# PHP API Dockerfile for Render.com
# PHP 8.2 + Apache (minimal version - Solana CLI will be added later if needed)

FROM php:8.2-apache

# Set working directory
WORKDIR /app

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers

# Copy API files
COPY api/ /app/api/

# Configure Apache
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /app\n\
    <Directory /app>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    <Directory /app/api>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Create startup script to handle PORT variable (Render requirement)
RUN echo '#!/bin/bash\n\
set -e\n\
PORT=${PORT:-80}\n\
echo "Starting Apache on port $PORT"\n\
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf || true\n\
sed -i "s/<VirtualHost \\*:80>/<VirtualHost *:$PORT>/g" /etc/apache2/sites-available/000-default.conf || true\n\
exec apache2-foreground' > /start.sh
RUN chmod +x /start.sh

# Expose port (Render will set PORT env var)
EXPOSE 80

# Start Apache
CMD ["/start.sh"]
