const request = require('supertest');
const express = require('express');
const workOrders = require('../../api/workOrder/woModel');
const woRouter = require('../../api/workOrder/woRouter');
const app = express();
app.use(express.json());

jest.mock('../../api/workOrder/woModel');

describe('profiles router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    app.use('/orders', woRouter);
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('returns status 200', async () => {
      workOrders.findAll.mockResolvedValue([]);
      const res = await request(app).get('/orders');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(workOrders.findAll.mock.calls.length).toBe(1);
    });
  });
});
