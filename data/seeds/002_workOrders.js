const faker = require('faker');

const workorder = [
  {
    id: 3,
    uuid: null,
    assignedTo: '00ulthapbErVUwVJy4x6',
    incLocation: 'kitchen', // incident location
    unitAddress: faker.address.secondaryAddress(), // for specific apartment unit not full address location
    dateCreated: faker.date.past(),
    dateClosed: faker.date.future(),
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
