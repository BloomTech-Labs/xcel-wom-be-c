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

// CREATE wo
router.post('/', async (req, res) => {
  const order = req.body;
  if (order) {
    const id = order.id || 0;
    try {
      await workOrders.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //workOrder not found so lets insert it
          await workOrders
            .create(order)
            .then((order) =>
              res
                .status(200)
                .json({ message: 'Work Order created', workorder: order[0] })
            );
        } else {
          res.status(400).json({ message: 'Work Order already exists' });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: 'Work Order missing' });
  }
});

module.exports = router;
