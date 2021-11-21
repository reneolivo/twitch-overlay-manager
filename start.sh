# Create Certificates
rm -rf ./certificates
mkdir ./certificates
openssl req -nodes -new -x509 \
  -keyout ./certificates/server.key \
  -out ./certificates/server.cert \
  -subj "/C=DO/ST=Santo Domingo/L=D.N./O=None/OU=None/CN=localhost"

# Fix NPM and root user issues
mkdir -p /home/app/.npm-global/bin \
    && npm config set prefix '/home/app/.npm-global' \
    && npm install -g pm2
export PATH=/home/app/.npm-global/bin:${PATH}

# Install dependencies
npm ci

# Create empty token file
touch ./token.json

# Start server
pm2 start npm --name "twitch-rewards" -- start
pm2 logs all
