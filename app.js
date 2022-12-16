const express = require('express');
// const fs = require('fs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// sET SECURITY http HEASERS
// app.use(helmet());
// console.log(process.env.NODE_ENV);
// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// // Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this Ip, please try again in an hour!',
// });
// app.use('/api', limiter);

// these middlewares we want to apply for all of the routes
app.use(express.json()); // middleware (middle of the request and the response
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// 3) ROUTES (this middlewares we want to apply the tourRouter and userRouter )
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;

// app.use(globalErrorHandler);

// app.get('/1', (req, res) => {
//   // use status cpde  example 200for okay
//   //   res.status(200).send('Hello from the server side!');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// app.post('/api/v1/tours', (req, res) => {
//   console.log(req.body);
//   res.send('Done');
// });

// app.get('/api/v1/tours', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// use parameters
// :id? this params is optionnel in url
// app.get('/api/v1/tours/:id/:idT?', (req, res) => {

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);

// This is better solution
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);
