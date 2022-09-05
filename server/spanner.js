// Imports the Google Cloud client library
const {Spanner} = require('@google-cloud/spanner');

const spanner = new Spanner({projectId: process.env.PROJECT_ID});

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(process.env.INSTANCE);
const database = instance.database(process.env.DATABASE);

export default database