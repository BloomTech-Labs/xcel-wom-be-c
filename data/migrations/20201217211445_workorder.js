exports.up = (knex) => {
  return knex.schema.createTable('workOrders', function (table) {
    table.integer('id').notNullable().unique().primary();
    table.uuid('uuid');
    table.string('requestId');
    table
      .foreign('assignedTo', 'profile_id')
      .references('id')
      .inTable('profile');
    table.string('incLocation').notNullable();
    table.string('unitAddress').notNullable();
    table.dateTime('dateCreated').defaultTo(knex.function.now());
    table.dateTime('dateClosed');
    table.string('description').notNullable();
    table.string('priority').defaultTo(null);
    table.string('status').defaultTo('unassigned');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('workOrders');
};
