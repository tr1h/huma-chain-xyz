# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    wget \
    build-essential \
    pkg-config \
    libssl-dev \
    libudev-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required for spl-token-cli)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Verify Rust installation
RUN rustc --version && cargo --version

# Install Solana CLI (direct binary download)
RUN wget -qO- https://github.com/solana-labs/solana/releases/download/v1.18.18/solana-release-x86_64-unknown-linux-gnu.tar.bz2 | tar -xjv && \
    mv solana-release/bin/* /usr/local/bin/ && \
    rm -rf solana-release

# Verify Solana installation
RUN solana --version

# Install spl-token CLI
RUN cargo install spl-token-cli --version 3.4.0

# Verify spl-token installation
RUN spl-token --version

# Copy project files
COPY . /var/www/html/

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configure Apache VirtualHost
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

# Set ServerName to suppress Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Create directory for keypairs
RUN mkdir -p /app

# Set working directory
WORKDIR /var/www/html

# Expose port 80 (Railway will map to $PORT)
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
