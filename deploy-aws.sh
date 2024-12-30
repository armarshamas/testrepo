#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Telegram Bot deployment on AWS..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
echo "📦 Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2 globally
echo "📦 Installing PM2 process manager..."
sudo npm install -y pm2 -g

# Create app directory
echo "📁 Creating application directory..."
mkdir -p ~/telegram-bot
cd ~/telegram-bot

# Clone the repository (replace with your actual repository URL)
echo "📥 Cloning repository..."
git clone https://your-repository-url.git .

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Create .env file
echo "⚙️ Setting up environment variables..."
cat > .env << EOL
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
ADMIN_USER_ID=${ADMIN_USER_ID}
COMMUNITY_GROUP_ID=${COMMUNITY_GROUP_ID}
PORT=3000
EOL

# Start the application with PM2
echo "🚀 Starting the bot..."
pm2 start src/index.js --name "telegram-bot"

# Save PM2 process list and configure to start on system startup
echo "⚙️ Configuring PM2 startup..."
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "✅ Deployment complete! Your bot is now running."
echo "📝 Useful commands:"
echo "  - Check bot status: pm2 status"
echo "  - View logs: pm2 logs telegram-bot"
echo "  - Restart bot: pm2 restart telegram-bot"