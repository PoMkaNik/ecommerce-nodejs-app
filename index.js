const express = require('express');
const cookieSession = require('cookie-session');
// routers
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

const PORT = process.env.PORT || 3030

// define public folder for static files
app.use(express.static('public'));
// all middleware before routes
// app.use(bodyParser.urlencoded({ extended: true })); ->
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['sihfjkssdapoqjwke34sfdq23@rsdfh'],
  }),
);
// use routers
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);
// start the server
app.listen(PORT, () => {
  console.log('server started at 3030');
});

// Export the Express API
module.exports = app
