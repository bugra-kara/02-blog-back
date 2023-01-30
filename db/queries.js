const { Pool } = require("pg")
const pool = async (query) => {
    const pool = new Pool({
      user: "poxwxwcp",
      host: "trumpet.db.elephantsql.com",
      database: "poxwxwcp",
      password: "9xKLN6n0uBSjLd8moW0aczhYLjNE5J0B",
      port: 5432
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