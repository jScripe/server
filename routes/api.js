'use strict';

// кеш кат и товар. рефакт. токен в хедер. добавить пут метод для эдд товар. доабвить коды ошибок 


const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var bodyParserJson = bodyParser.json();
const fs = require('fs');


const catalog = require('../data/categories');
const goods = require('../data/goods');
const users = require('../data/users');
const usersCart = require('../data/usersCart');




// let Categories = require('../controlles/categories');

// let categories = new Categories;



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

////////////////////////////////////////////////////////////////////

router.get('/categories', (req, res) => {
  res.send(catalog.categories);
})

// router.get('/categories', categories.returnTheCatalog(req, res, catalog));

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

////////////////////////////////////////////////////////////////////////

function checkLogin(obj, reqName) {
  let flag = true;
  for(let user in obj) {
    if(user === reqName) {
      flag = false;
    }
  }
  return flag;
}

router.post('/registration', bodyParserJson, (req, res) => {
  let data = users;
  if(checkLogin(users, req.body.username)) {
    data[req.body.username] = {"password":req.body.password};
    fs.writeFile('./data/users.json', JSON.stringify(data));
    res.send('регистрация прошла успешно!');
  } else {
    res.status('409').send('пользователь с таким именем уже существует');
  }
})

router.post('/login', bodyParserJson, (req, res) => {
  let data = users;
  let secretLine = 'dsffds2354asvcfd2432zzz';
  
  if(!checkLogin(users, req.body.username)) {
    for(let user in data) {
      if(user === req.body.username && data[user].password === req.body.password) {
        data[req.body.username].token = secretLine + user;
        fs.writeFile('./data/users.json', JSON.stringify(data));
        res.header("Access-Control-Allow-Origin", "*");
        res.send(data[req.body.username].token);
      } else if (user !== req.body.username || data[user].password !== req.body.password) {
        res.status(400).send('Введённые данные не верны, повторите попытку');
      }
    } 
  }
  res.status(401).send("Зарегистрируйтесь пожалуйста!");
})

router.post('/logout', bodyParserJson, (req,res) => {
  let data = users;
  data[req.body.username].token = '';
  fs.writeFile('./data/users.json', JSON.stringify(data));
  res.send('logged out')
})

/////////////////////////////////////////////////////////////////////////

function checkProductCart(products, categoryId, itemId) {
  let flag = false;
  products.forEach((product) => {
    if(+product.id === +itemId && +product.categoryId === +categoryId) {
        flag = true;
        increaseTheCounter(product);
      }
      console.log(product.id);
    }
    // console.log(flag);
  ) 
  return flag;  
}

function increaseTheCounter(item) {
  return item.currentValue += 1;
}

router.post('/cart', bodyParserJson, (req, res) => {
  let data = usersCart;
  const categoryId = req.body.categoryId;
  const itemId = req.body.id;
  let goods = getItemById(categoryId, itemId);
  if(Object.keys(data).length == 0) {
    data[req.body.token] = goods;
    fs.writeFile('./data/usersCart.json', JSON.stringify(data));
    res.send('product successfully added');
  } else if(checkProductCart(data[req.body.token], categoryId, itemId)) {
    fs.writeFile('./data/usersCart.json', JSON.stringify(data));
    res.send('you have successfully added a similar product');
  } else {
    data[req.body.token].push(goods[0]);
    fs.writeFile('./data/usersCart.json', JSON.stringify(data));
    res.send('product successfully added');
  }
})

router.delete('/cart', bodyParserJson, (req, res) => {
  let data = usersCart;
  const categoryId = req.body.categoryId;
  const itemId = req.body.id;
  data[req.body.token] = usersCart[req.body.token].filter((item) => {
    return !(item.id === +itemId && item.categoryId === +categoryId);
  });
  fs.writeFile('./data/usersCart.json', JSON.stringify(data));
  res.send('delete successfully');
})

router.get('/cart', (req, res) => {
  if(usersCart[req.headers.token] === undefined) {
    res.status('204').send('Корзина пуста');
  }
  let data = usersCart[req.headers.token]
  res.send(data);
})
/////////////////////////////////////////////////////////////////////////


module.exports = router;


// кеш кат и товар. рефакт. токен в хедер. добавить пут метод для эдд товар. доабвить коды ошибок 
