'use strict';

/**
 * script to create the Database if not already present
 * The Knex migrations rely on it being there - adding a migration for creating the DB itself is not possible
 */

const config = require('./config')[process.env.NODE_ENV];
const dbName = config.database.connection.database;

async function createDatabase() {
    // set the database null, otherwise it will try to connect to it
    config.database.connection.database = null;
    const knex = require('knex')(config.database);

    await knex.raw('CREATE DATABASE IF NOT EXISTS ' + dbName);
    await knex.destroy();
}

createDatabase().then(() => {
    console.log('created database if not existing already')
}, r => {
    console.error('failed to create database, error: ' + r);
});