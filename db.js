const oracledb = require('oracledb');

// Setup database parameters
const dbConfig = {
  user: 'p.dande',
  password: 'a8OiFbTP5G1wwVhsBtg9VN7O',
  connectString: 'oracle.cise.ufl.edu:1521/orcl' // format: host:port/service_name
};

// Create a pool to manage connections
oracledb.createPool(dbConfig, (err, pool) => {
  if (err) {
    console.error("Unable to create connection pool due to:", err);
    process.exit(1);
  }
});

module.exports.execute = async function (sql, binds = [], opts = {}) {
    let conn;
    opts.outFormat = oracledb.OUT_FORMAT_OBJECT; 
    try {
      conn = await oracledb.getConnection();
      const result = await conn.execute(sql, binds, opts);
      return result;
    } catch (err) {
      console.error("Database execute error:", err);
      throw err; // Re-throw the error to be caught in the calling function
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.error("Error closing connection:", err);
        }
      }
    }
  };