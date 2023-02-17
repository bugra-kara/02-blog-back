module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: process.env.PASSWORD2,
    DB: "KB",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };