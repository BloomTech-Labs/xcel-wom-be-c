const express = require('express');
// const authRequired = require('../middleware/authRequired');
const workOrders = require('./woModel');
const router = express.Router();

// get all WO's

/**
 * @swagger
 * components:
 *  schemas:
 *    workOrder:
 *      type: object
 *      required:
 *        - id
 *        - incLocation
 *        - unitAddress
 *        - description
 *      properties:
 *        id:
 *          type: string
 *          description: This is a unique autoincrementally created key
 *        uuid:
 *          type: string
 *        assignedTo:
 *          type: string
 *          description: okta id of worker assigned to task
 *        incLocation:
 *          type: string
 *          description: location of incident
 *        unitAddress:
 *          type: string
 *          description: address of specific apartment or unit
 *        dateCreated:
 *          type: datetime
 *          description: time work order created
 *        dateClosed:
 *          type: datetime
 *          description: time work order closed
 *        description:
 *          type: string
 *          description: description of incident or item needing maintenance
 *        priority:
 *          type: string
 *          description: level of priority in
 *        status:
 *          type: string
 *          description: status of assigned ticket
 *      example:
 *        id: 1
 *        uuid: null
 *        assignedTo: '00ulthapbErVUwVJy4x6'
 *        incLocation: 'basement'
 *        unitAddress: 'Suite 211'
 *        dateCreated: '2020-12-27T18:44:15.652Z'
 *        dateClosed: '2021-10-07T05:04:36.481Z'
 *        description: 'Furnace is not working'
 *        priority: '1'
 *        status: 'assigned'
 *
 * /orders:
 *  get:
 *    description: Returns a list of workOrders
 *    summary: Get a list of all workOrders
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    responses:
 *      200:
 *        description: array of workOrders
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/workOrder'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

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

/**
 * @swagger
 * components:
 *  parameters:
 *    workOrderId:
 *      name: id
 *      in: path
 *      description: ID of the workOrder to return
 *      required: true
 *      example: 3
 *      schema:
 *        type: integer
 *
 * /orders/{id}:
 *  get:
 *    description: Find a single workOrder by ID
 *    summary: Returns a single workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    parameters:
 *      - $ref: '#/components/parameters/workOrderId'
 *    responses:
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/WorkOrder'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'WorkOrder not found'
 */

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

/**
 * @swagger
 * /orders:
 *  post:
 *    summary: Add a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    requestBody:
 *      description: WorkOrder object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkOrder'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'WorkOrder not found'
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: workOrder created
 *                workOrder:
 *                  $ref: '#/components/schemas/WorkOrder'
 */

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

// DELETE wo

/**
 * @swagger
 * /orders/{id}:
 *  delete:
 *    summary: Remove a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    parameters:
 *      - $ref: '#/components/parameters/workOrderId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: WorkOrder 3 was deleted.
 *                workOrder:
 *                  $ref: '#/components/schemas/WorkOrder'
 */

router.delete('/:id', function (req, res) {
  const id = req.params.id;
  try {
    workOrders.findById(id).then((wo) => {
      workOrders.remove(wo.id).then(() => {
        res
          .status(200)
          .json({ message: `work Order ${id} was deleted.`, deleted: wo.id });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete work Order ID: ${id}`,
      error: err.message,
    });
  }
});

// UPDATE wo

/**
 * @swagger
 * /orders:
 *  put:
 *    summary: Update a workOrder
 *    security:
 *      - okta: []
 *    tags:
 *      - workOrder
 *    requestBody:
 *      description: WorkOrder object to to be updated
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WorkOrder'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A workOrder object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: workOrder created
 *                workOrder:
 *                  $ref: '#/components/schemas/WorkOrder'
 */

router.put('/:id', function (req, res) {
  const order = req.body;
  if (order) {
    const id = req.params.id;
    workOrders
      .findById(id)
      .then(
        workOrders
          .update(id, order)
          .then((updated) => {
            res.status(200).json({
              message: `Successfully updated order ${id}`,
              order: updated,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update order '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find order '${id}'`,
          error: err.message,
        });
      });
  }
});

module.exports = router;
