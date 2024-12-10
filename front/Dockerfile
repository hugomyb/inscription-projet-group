FROM node:18
WORKDIR /usr/src/app

# Installer les dépendances système requises pour Cypress
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    libx11-xcb1 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @angular/cli
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm", "run", "start"]
