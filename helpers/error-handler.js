function errorHandler(err, req, res, next) {
  console.error('🔥 Unexpected Error:', err.stack);
  if(err.name === 'UnauthorizedError'){

    return res.status(500).json({success: false, message: 'User is not autherized'})
  }
  res.status(500).json({ success: false, message: 'Something went wrong!' });
}

module.exports = errorHandler;