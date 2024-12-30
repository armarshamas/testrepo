import express from 'express';
import bot from './bot.js';
import './cron.js'; // Import cron job for scheduled publishing

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Telegram Bot is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});