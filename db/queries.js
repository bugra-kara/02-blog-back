const { Pool } = require("pg")
const pool = async (query) => {
    const pool = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT,
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
      client.end()
    }
}

module.exports = pool