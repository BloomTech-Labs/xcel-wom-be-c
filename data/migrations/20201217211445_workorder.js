exports.up = (knex) => {
  return knex.schema.createTable('workOrders', function (table) {
    table.integer('id').notNullable().unique().primary().increment();
    table.uuid('uuid');
    table.string('assignedTo');
    table.foreign('assignedTo').references('id').inTable('profiles');
    table.string('incLocation').notNullable();
    table.string('unitAddress').notNullable();
    table.dateTime('dateCreated').defaultTo(knex.fn.now());
    table.dateTime('dateClosed');
    table.string('description').notNullable();
    table.string('priority').defaultTo(null);
    table.string('status').defaultTo('unassigned');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('workOrders');
};
