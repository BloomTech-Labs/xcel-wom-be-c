const faker = require('faker');

const workorder = [
  {
    
    uuid: null,
    requestId: 'faker.random.alphaNumeric(10)',
    assignedTo: '00ulthapbErVUwVJy4x6',
    incLocation: 'kitchen', // incident location
    unitAddress: faker.address.secondaryAddress, // for specific apartment unit not full address location
    dateCreated: faker.date.soon,
    dateClosed: faker.date.future,
    description: 'Oven is not working',
    priority: '1',
    status: 'assigned',
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('workOrders')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('workOrders').insert(workorder);
    });
};
