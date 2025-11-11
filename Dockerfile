# PHP API Dockerfile for Render.com
# PHP 8.2 + Apache + Solana CLI (optimized with multi-stage build)

# Stage 1: Install Solana CLI (pre-built binaries, fast)
FROM ubuntu:22.04 as solana-installer

WORKDIR /tmp

# Install curl and ca-certificates only
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI (includes spl-token, no compilation needed!)
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)" && \
    export PATH="/root/.local/share/solana/install/active_release/bin:$PATH" && \
    solana --version && \
    spl-token --version

# Stage 2: PHP + Apache + Copy Solana CLI
FROM php:8.2-apache

# Set working directory
WORKDIR /app

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy Solana CLI from stage 1 (much faster than installing again)
COPY --from=solana-installer /root/.local/share/solana /root/.local/share/solana

# Set PATH for Solana CLI
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Verify Solana CLI is available
RUN export PATH="/root/.local/share/solana/install/active_release/bin:$PATH" && \
    solana --version && \
    spl-token --version

# Enable Apache modules
RUN a2enmod rewrite headers

# Copy API files
COPY api/ /app/api/

# Copy .htaccess from root for routing
COPY .htaccess /app/.htaccess

# Ensure .htaccess in api/ directory exists for routing
RUN echo 'RewriteEngine On\n\
RewriteCond %{REQUEST_URI} ^/api/tama\n\
RewriteCond %{REQUEST_URI} !tama_supabase\.php$\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteRule ^(.*)$ tama_supabase.php [QSA,L]' > /app/api/.htaccess

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
    # Fallback: Route /api/tama/* to tama_supabase.php if .htaccess fails\n\
    RewriteCond %{REQUEST_URI} ^/api/tama\n\
    RewriteCond %{REQUEST_URI} !tama_supabase\.php$\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteRule ^/api/tama(.*)$ /api/tama_supabase.php [QSA,L]\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Create startup script to handle PORT variable (Render requirement)
RUN echo '#!/bin/bash\n\
set -e\n\
PORT=${PORT:-80}\n\
echo "Starting Apache on port $PORT"\n\
echo "Solana CLI version:"\n\
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"\n\
solana --version || echo "⚠️ Solana CLI not found"\n\
spl-token --version || echo "⚠️ spl-token not found"\n\
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf || true\n\
sed -i "s/<VirtualHost \\*:80>/<VirtualHost *:$PORT>/g" /etc/apache2/sites-available/000-default.conf || true\n\
exec apache2-foreground' > /start.sh
RUN chmod +x /start.sh

# Expose port (Render will set PORT env var)
EXPOSE 80

# Start Apache
CMD ["/start.sh"]
