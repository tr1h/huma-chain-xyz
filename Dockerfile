# Minimal PHP API Dockerfile for Render.com
FROM php:8.2-apache

# Set working directory
WORKDIR /app

# Install PostgreSQL client for pg_connect
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers

# Copy API files
COPY api/ /app/api/

# Copy .htaccess from root for routing
COPY .htaccess /app/.htaccess

# Use .htaccess from repository (don't overwrite)
# api/.htaccess already contains routing rules

# Configure Apache with proper routing
RUN echo '<VirtualHost *:80>\n\
    ServerName localhost\n\
    DocumentRoot /app\n\
    <Directory /app>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        RewriteEngine On\n\
    </Directory>\n\
    <Directory /app/api>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        RewriteEngine On\n\
    </Directory>\n\
    # Fallback: Route /api/tama-v2/* to tama_api_v2.php (modular API)\n\
    RewriteCond %{REQUEST_URI} ^/api/tama-v2\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteRule ^/api/tama-v2(.*)$ /api/tama_api_v2.php [QSA,L]\n\
    # Fallback: Route /api/tama/* to tama_supabase.php if .htaccess fails\n\
    RewriteCond %{REQUEST_URI} ^/api/tama\n\
    RewriteCond %{REQUEST_URI} !tama_supabase\.php$\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteRule ^/api/tama(.*)$ /api/tama_supabase.php [QSA,L]\n\
    # Fallback: Route /api/mint-nft-onchain to mint-nft-onchain-wrapper.php\n\
    RewriteCond %{REQUEST_URI} ^/api/mint-nft-onchain\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteRule ^/api/mint-nft-onchain$ /api/mint-nft-onchain-wrapper.php [QSA,L]\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Create startup script
RUN echo '#!/bin/bash\n\
PORT=${PORT:-80}\n\
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf\n\
sed -i "s/<VirtualHost \\*:80>/<VirtualHost *:$PORT>/g" /etc/apache2/sites-available/000-default.conf\n\
exec apache2-foreground' > /start.sh && chmod +x /start.sh

# Expose port (Render will set PORT env var)
EXPOSE 80

# Start Apache
CMD ["/start.sh"]
