const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['sihfjkssdapoqjwke34sfdq23@rsdfh'],
  }),
);
app.use(authRouter);

app.listen(3000, () => {
  console.log('server started at 3000');
});
