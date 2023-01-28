const { Pool } = require("pg")
const pool = async (query) => {
    const pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "KB",
      password: "Abk1512?",
      port: 5432,
      connectionTimeoutMillis: 2000,
    })
    const client = await pool.connect()
    try {
        const res = await client.query(query)
        return res
    } 
    catch (error) {
      return error
    }
    finally {
      client.release()
    }
}

module.exports = pool