function errorHandler(err, req, res, next) {
  console.error('🔥 Unexpected Error:', err.stack);
  if(err.name === 'UnauthorizedError'){

    return res.status(401).json({success: false, message: 'User is not autherized'})
  }

  if(err.name === 'validationError'){
    return res.status(401).json({success: false, message: err })
  }
  
  res.status(500).json({ success: false, message: 'Something went wrong!' });
}

module.exports = errorHandler;