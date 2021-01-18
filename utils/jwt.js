// const jwt = require('jsonwebtoken');
// const authenticateToken = (req, res, next) => {
//   console.log('Cookies search', req.cookies);
//   const token = req.cookies['clientIdToken'];
//   if (!token) {
//     res.status(400).send('Unauthorized Access');
//   } else {
//     jwt.verify(token, process.env.JWT_KEY, (err, data) => {
//       if (err) return res.status(403).send({ msg: 'Access Forbidden' });
//       console.log('Hotel data', data);
//       req.client_id = data.resturant_id;
//       next();
//     });
//   }
// };

// module.exports = authenticateToken;
