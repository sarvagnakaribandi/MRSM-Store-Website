/**
 * 404 Not Found Handler for Unregistered API Endpoints
 */
module.exports = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `The requested route "${req.method} ${req.originalUrl}" does not exist on this server.`
    }
  });
};
