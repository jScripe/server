'use strict';

const express = require('express');
const router = express.Router();

const catalog = require('../data/categories');
const goods = require('../data/goods');

function getCategoryById(id) {
  const result = catalog.categories.filter(item => {
    return item.id === +id;
  });
  return result;
}

function getGoodsFromSpecificCategory(categoryId) {
  const result = goods.filter(item => {
    return item.categoryId === +categoryId;
  });
  return result;
}

function getItemById(categoryId, itemId) {
  const result = goods.filter(item => {
    return item.categoryId === +categoryId && item.id === +itemId;
  });
  return result;
}

router.get('/categories', (req, res) => {
  res.send(catalog);
})

router.get('/categories/:categoryId', (req, res) => {
  const id = req.params.categoryId;
  const category = getCategoryById(id);
  res.send(category);
})

router.get('/categories/:categoryId/goods', (req, res) => {
  const id = req.params.categoryId;
  const goods = getGoodsFromSpecificCategory(id);
  res.send(goods);
})

router.get('/categories/:categoryId/goods/:itemId', (req, res) => {
  const categoryId = req.params.categoryId;
  const itemId = req.params.itemId;
  const item = getItemById(categoryId, itemId);
  res.send(item)
})

module.exports = router;
