const { Client } = require("pg")
const client = async (query) => {
    const client = new Client({
      user: "poxwxwcp",
      host: "trumpet.db.elephantsql.com",
      database: "poxwxwcp",
      password: "9xKLN6n0uBSjLd8moW0aczhYLjNE5J0B",
      port: 5432,
    })
    client.connect()
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

module.exports = client