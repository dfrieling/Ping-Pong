'use strict';




exports.up = function(knex, Promise) {
    return knex.schema
        .alterTable('players', function(table){
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).alter();
        })
};




exports.down = function(knex, Promise) {
    return knex.schema
        .alterTable('players', function(table){
            table.timestamp('updated_at').alter();
        })
};
