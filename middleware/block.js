const checkReferer = async (req, res, next) => {
    const referer = req.get('Referer');
    const allowedReferers = ['http://localhost:3000/','http://localhost:3001/','https://clientsserver.vercel.app','http://localhost:5173/']
    
    if (referer && allowedReferers.some(url => referer.includes(url))) {
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Cif','0xx00000111189956'); // Add CIF header here
        res.status(200).end();
      } else {
        next();
      }
    } else {
      // Block the device if not from allowed referers
      try {
        return res.status(403).json({
          status: false,
          status_code: 403,
          message: 'You do not have permission to use this API'
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          status_code: 500,
          message: 'An error occurred while processing your request.'
        });
      }
    }
  };

  module.exports = checkReferer
