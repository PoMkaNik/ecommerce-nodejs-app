const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// all middleware before routes
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['sihfjkssdapoqjwke34sfdq23@rsdfh'],
  }),
);
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log('server started at 3000');
});
