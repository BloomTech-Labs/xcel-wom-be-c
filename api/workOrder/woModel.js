const db = require('../../data/db-config');

const findAll = async () => {
  return await db('workOrders');
};

const findBy = async (filter) => {
  return db('workOrders').where(filter);
};

const findById = async (id) => {
  return db('workOrders').where({ id }).first().select('*');
};

const create = async (wo) => {
  return db('workOrders').insert(wo).returning('*');
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
};
