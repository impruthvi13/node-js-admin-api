const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeaturs');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Not document found on this ID', 404));
    }
    res.status(200).json({
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('Not document found on this ID', 404));
    }
    res.status(200).json({
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      data: doc
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Not document found on this ID', 404));
    }
    res.status(200).json({
      data: doc
    });
  });

exports.getAll = Model =>
catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const doc = await features.query;

    res.status(200).json({
      data: doc,
      meta: {
        message:  `Find Successfully.`
      }
    });
  });
