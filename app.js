require('dotenv').config()

const express = require('express')
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

//routes
const authRoute = require('./routes/authRoute')
const dashboardRoute = require('./routes/dashboardRoute')
const publicRoute = require('./routes/publicRoute')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 500000,
  })
)
app.use(helmet());
app.use(cors({
  origin: 'https://bugradev-blog.netlify.app/',
  credentials: true
}));
app.use(xss());

app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.setHeader('Access-Control-Allow-Origin', 'https://bugradev-blog.netlify.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next()
})
// Route linking
app.use('/api/auth', authRoute)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/public', publicRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3454
const start = async () => {
    try {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error)
    }
  }; 
start()
