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
  describe('GET /orders/:orderId', () => {
    it('returns status 200 if wo exists', async () => {
      // mock data matches seed data so we know it will exist for the test
      workOrders.findById.mockResolvedValue({
        id: 3,
        uuid: null,
        assignedTo: '00ulthapbErVUwVJy4x6',
        incLocation: 'kitchen',
        unitAddress: 'Suite 061',
        dateCreated: '2020-05-29T18:11:06.712Z',
        dateClosed: '2021-09-13T09:20:51.968Z',
        description: 'Oven is not working',
        priority: '1',
        status: 'assigned',
      });
      const res = await request(app).get('/orders/4');

      expect(res.status).toBe(200);
      expect(res.body.assignedTo).toBe('00ulthapbErVUwVJy4x6');
      expect(workOrders.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no user found', async () => {
      workOrders.findById.mockResolvedValue();
      const res = await request(app).get('/orders/fake12345');
      expect(res.status).toBe(404);
    });
  });
});
