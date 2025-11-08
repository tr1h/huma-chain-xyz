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
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    <FilesMatch \.php$>\n\
        SetHandler application/x-httpd-php\n\
    </FilesMatch>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Create startup script to handle PORT variable
RUN echo '#!/bin/bash\n\
# Railway provides PORT, but Apache listens on 80\n\
# Railway automatically maps $PORT to container port 80\n\
# So we just start Apache normally\n\
exec apache2-foreground' > /start-apache.sh && \
    chmod +x /start-apache.sh

# Set ServerName to suppress Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Optimize Apache for production (prevent crashes)
# Note: PHP Apache uses prefork MPM, not worker
RUN echo "\n\
# Production optimizations (prefork MPM)\n\
<IfModule mpm_prefork_module>\n\
    StartServers 5\n\
    MinSpareServers 5\n\
    MaxSpareServers 10\n\
    MaxRequestWorkers 150\n\
    MaxConnectionsPerChild 10000\n\
</IfModule>\n\
KeepAlive On\n\
KeepAliveTimeout 5\n\
Timeout 300\n\
" >> /etc/apache2/apache2.conf

# Create directory for keypairs
RUN mkdir -p /app

# Set working directory
WORKDIR /var/www/html

# Expose port 80 (Railway will map to $PORT)
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
