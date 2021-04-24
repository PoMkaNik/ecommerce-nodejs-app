const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');

const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// receive post request to add item to a card
router.post('/cart/products', async (req, res) => {
  // is cart for user already exist
  let cart;
  if (!req.session.cartId) {
    // no cart previously created
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // cart is exist
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId,
  );
  if (existingItem) {
    // increase quantity for existing item if any
    existingItem.quantity++;
  } else {
    // or add new item to the cart
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.redirect('/cart');
});

// receive get request to show all items in a cart
router.get('/cart', async (req, res) => {
  // user hasn't a cart
  if (!req.session.cartId) return res.redirect('/');
  // user has a cart
  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

// receive a post request to delete item from a cart
router.post('/cart/products/delete', async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter((item) => item.id !== req.body.itemId);
  await cartsRepo.update(cart.id, { items });

  res.redirect('/cart');
});

module.exports = router;
