const trackingRoutes = require('./tracking_routes');
module.exports = (app, client, logger) => {
    trackingRoutes(app, client, logger);
};