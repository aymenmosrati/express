// const fs = require('fs');
const Tours = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    // console.log('queryObj : ', queryObj);
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj); // convertir in json object
    // console.log('queryStr : ', queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //all these function we added $
    // console.log('queryStr : ', queryStr);
    // console.log(JSON.parse(queryStr)); // convertir thisjson in object
    let query = Tours.find(JSON.parse(queryStr)); // send object in query
    // { difficulty:'easy',duration:{$gte: 5} } // filter object for the query
    //{ difficulty: 'easy', duration: { gte: '5' } }

    // 2) Sorting
    if (req.query.sort) {
      // console.log('request ', req.query.sort);
      const sortBy = req.query.sort.split(',').join(' '); // send espace if you show ','
      // console.log('sortBy ', sortBy);
      query = query.sort(sortBy);
      // console.log('query ', query);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // EXECUTE QUERY
    const tours = await query;

    // const tours = await Tours.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //  SEND QUERY
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tours.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tours.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      // message: 'Invalid data sent!',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tours = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      rubValidators: true,
    });
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tours.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.checkBody = (req, res, next) => {
  console.log('hey');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// 2) ROUTER HANDLERS
// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requesteAt: req.requestTime,
//     // results: tours.length,
//     // data: { tours },
//   });
//   // next();
// };

// exports.getTour = (req, res) => {
//   console.log(req.params);
//   // we use params and multiple of tow because i'm converting it to a number here as well
//   const id = req.params.id * 1;

//   //   const tour = tours.find((el) => el.id === id);
//   //   // if (!tour) {
//   //   //     return res.status(404).json({
//   //   //         status: 'fail',
//   //   //         message: 'Invalid ID',
//   //   //     });
//   //   // }
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour,
//   //     },
//   //   });
// };

// exports.createTour = async (req, res) => {
//   //   console.log(req.body);
//   //   const newId = tours[tours.length - 1].id + 1;
//   //   const newTour = Object.assign({ id: newId }, req.body);
//   //   console.log(newTour);
//   //   tours.push(newTour);
//   //   fs.writeFile(
//   //     `${__dirname}/dev-data/data/tours-simple.json`,
//   //     JSON.stringify(tours),
//   //     (err) => {
//   res.status(201).json({
//     status: 'success',
//     // data: {
//     //   tour: newTour,
//     // },
//   });
//   // }
//   //   );
// };

// exports.updateTour = (req, res) => {
//   return res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here...>',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   // if (req.params.id * 1 > tours.length) {
//   //     return res.status(404).json({
//   //         status: 'fail',
//   //         message: 'Invalid ID',
//   //     });
//   // }
//   return res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
