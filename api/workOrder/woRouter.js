const express = require('express');
// const authRequired = require('../middleware/authRequired');
const workOrders = require('./woModel');
const router = express.Router();

// get all WO's
router.get('/', function (req, res) {
  workOrders
    .findAll()
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

// get WO by id
router.get('/:id', function (req, res) {
  workOrders
    .findById(req.params.id)
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// CREATE wo

module.exports = router;
