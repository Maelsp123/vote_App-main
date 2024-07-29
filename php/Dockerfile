FROM php:7.4-apache
# Installer les extensions nécessaires
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql
# Copier les fichiers du projet dans le conteneur
COPY . /var/www/html/
# Exposer le port 80
EXPOSE 80
