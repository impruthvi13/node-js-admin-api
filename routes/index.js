module.exports = app => {
    app.use('/api', [
        require('./authRoutes'), 
        require('./userRoutes'),
    ]);
};