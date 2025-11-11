# PHP API Dockerfile for Render.com
# PHP 8.2 + Apache + Solana CLI

FROM php:8.2-apache

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required for Solana CLI)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install spl-token CLI
RUN cargo install spl-token-cli

# Enable Apache modules (PHP is already enabled in php:8.2-apache image)
RUN a2enmod rewrite headers

# Copy API files
COPY api/ /app/api/

# Copy .htaccess if exists
COPY .htaccess /app/.htaccess 2>/dev/null || true

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

