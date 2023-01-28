module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Abk1512?",
    DB: "KB",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };