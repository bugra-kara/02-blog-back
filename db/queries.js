const { Pool } = require("pg")
const pool = async (query) => {
    const pool = new Pool({
      user: "trumpet.db.elephantsql.com",
      host: "localhost",
      database: "poxwxwcp",
      password: "9xKLN6n0uBSjLd8moW0aczhYLjNE5J0B",
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