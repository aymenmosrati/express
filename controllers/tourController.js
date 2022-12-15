// const fs = require('fs');
const Tours = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);

    // // BUILD QUERY
    // // 1A) Filtering
    // const queryObj = { ...req.query };
    // // console.log('queryObj : ', queryObj);
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach((el) => delete queryObj[el]);

    // // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj); // convertir in json object
    // // console.log('queryStr : ', queryStr);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //all these function we added $
    // // console.log('queryStr : ', queryStr);
    // // console.log(JSON.parse(queryStr)); // convertir thisjson in object
    // let query = Tours.find(JSON.parse(queryStr)); // send object in query
    // // { difficulty:'easy',duration:{$gte: 5} } // filter object for the query
    // //{ difficulty: 'easy', duration: { gte: '5' } }

    // 2) Sorting
    // if (req.query.sort) {
    //   // console.log('request ', req.query.sort);
    //   const sortBy = req.query.sort.split(',').join(' '); // send espace if you show ','
    //   // console.log('sortBy ', sortBy);
    //   query = query.sort(sortBy);
    //   // console.log('query ', query);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // 3) Field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) Pagination
    // // page = number of page || by default page 1
    // const page = req.query.page * 1 || 1;
    // // limit = limit of request get || by default get me 100
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // // page=2&limit=10
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tours.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    // EXECUTE QUER
    const features = new APIFeatures(Tours.find(), req.query)
      .filtre()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    // query.sort().select().skip().limit()

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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tours.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgRating: { $avg: '$price' },
          // MINIMUM FOR PRICE FOR THE JSON HAVE THE SAME DIFFICULTY
          minPrice: { $min: '$price' },
          // MAXIMUM FOR PRICE FOR THE JSON HAVE THE SAME DIFFICULTY
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tours.aggregate([
      // first stage
      {
        $unwind: '$startDates',
      },
      // second stage
      // condition
      // {
      //   $match: {
      //     startDates: {
      //       $gte: new Date(`${year}-01-01`),
      //       $lte: new Date(`${year}-12-31`),
      //     },
      //   },
      // },
      // Third Stage
      {
        $group: {
          _id: { $month: '$startDates' },
          nupmTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      // add Keys : value in documents
      // {
      //   $addFields: { month: '$_id' },
      // },
      // {
      //   $sort: { nupmTourStarts: -1 },
      // },
      // // limit the object json returned
      // {
      //   $limit: 12,
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
