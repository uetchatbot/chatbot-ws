'use strict';

/**
 * Auto load.
 */
require('./autoload');

/**
 * Database
 */
global.Models = require('./models/Models');

/**
 * Main app.
 */
require('./app/main');

/**
 * Scheduler for user matching
 */
require('./scheduler');