'use strict';




exports.up = function(knex, Promise) {
    return knex.schema
        .alterTable('players', function(table){
            table.timestamp('created_at').defaultTo(knex.fn.now()).alter();
        })
};




exports.down = function(knex, Promise) {
    return knex.schema
        .alterTable('players', function(table){
            table.timestamp('created_at').alter();
        })
};
