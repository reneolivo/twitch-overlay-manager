import * as dotenv from 'dotenv';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as passport from 'passport';
import { Strategy } from 'passport-twitch-strategy';
import { getOverlays } from './services/getOverlays';
import { readTokenFromDisk, writeTokenToDisk } from './services/tokens';
import { initPubSub } from './services/pubsub';

dotenv.config();
const app = express();
const TWITCH_API_SCOPE = 'channel:read:redemptions';

(async function () {
  const tokenData = await readTokenFromDisk();

  if (tokenData.accessToken) {
    await initPubSub(tokenData);
  }
})();

// Configure Views
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// Configure Twitch Passport Authentication
passport.use('twitch', new Strategy(
  {
    callbackURL: process.env.TWITCH_CALLBACK_URL,
    clientID: process.env.TWITCH_CLIENT,
    clientSecret: process.env.TWITCH_SECRET,
    scope: TWITCH_API_SCOPE,
  },
  async (accessToken: string, refreshToken: string, profile: object, done: Function) => {
    const initialToken = {
      accessToken,
      refreshToken,
      expiresIn: null,
      obtainmentTimestamp: new Date().getTime(),
      scope: [TWITCH_API_SCOPE],
    };

    await writeTokenToDisk(initialToken);
    await initPubSub(initialToken);

    done();
  },
));


// Routes

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/overlays', (req, res) => {
  const overlays = getOverlays();

  res.render('overlays', { overlays });
});

app.get('/auth/twitch', passport.authenticate('twitch', {
  scope: [
    'user_read',
    TWITCH_API_SCOPE,
  ],
}));

app.get(
  '/auth/twitch/callback',
  passport.authenticate('twitch', { successRedirect: '/rewards', failureRedirect: '/' })
);

app.listen(4000, () => {
  console.log('HTTP Server started on port 4000');
});

https.createServer(
  {
    key: fs.readFileSync('./certificates/server.key'),
    cert: fs.readFileSync('./certificates/server.cert')
  },
  app,
)
  .listen(3000, function () {
    console.log('HTTPS Server started on port 3000');
  });
