# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    wget \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI (includes spl-token binary in the same release!)
RUN wget -qO- https://github.com/solana-labs/solana/releases/download/v1.18.18/solana-release-x86_64-unknown-linux-gnu.tar.bz2 | tar -xjv && \
    mv solana-release/bin/* /usr/local/bin/ && \
    rm -rf solana-release

# Verify Solana installation
RUN solana --version

# Verify spl-token is available (it's in the same release package!)
RUN spl-token --version

# Copy project files
COPY . /var/www/html/

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configure Apache VirtualHost (listen on port 80, Railway maps $PORT)
RUN cat > /etc/apache2/sites-available/000-default.conf << 'EOF'
<VirtualHost *:80>
    DocumentRoot /var/www/html
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
    </Directory>
    <Directory /var/www/html/api>
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
    </Directory>
    <FilesMatch \.php$>
        SetHandler application/x-httpd-php
    </FilesMatch>
</VirtualHost>
EOF

# Create startup script to handle PORT variable
RUN cat > /start-apache.sh << 'EOF'
#!/bin/bash
# Railway provides PORT, but Apache listens on 80
# Railway automatically maps $PORT to container port 80
# So we just start Apache normally
exec apache2-foreground
EOF
RUN chmod +x /start-apache.sh

# Set ServerName to suppress Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Optimize Apache for production (prevent crashes)
# Note: PHP Apache uses prefork MPM, not worker
RUN cat >> /etc/apache2/apache2.conf << 'EOF'

# Production optimizations (prefork MPM)
<IfModule mpm_prefork_module>
    StartServers 5
    MinSpareServers 5
    MaxSpareServers 10
    MaxRequestWorkers 150
    MaxConnectionsPerChild 10000
</IfModule>
KeepAlive On
KeepAliveTimeout 5
Timeout 300
EOF

# Create directory for keypairs with proper permissions
RUN mkdir -p /app && \
    chown -R www-data:www-data /app && \
    chmod -R 755 /app

# Set working directory
WORKDIR /var/www/html

# Expose port 80 (Render will map to $PORT)
EXPOSE 80

# Enable Apache modules
RUN a2enmod headers

# Verify configuration
RUN apache2ctl configtest

# Start Apache in foreground
CMD ["apache2-foreground"]
