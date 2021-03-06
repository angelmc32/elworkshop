const express = require('express');                 // Import express for router functionality through its Router method
const router = express.Router();                    // Execute express router and store it into router const
const jwt = require('jsonwebtoken');                // Import jsonwebtoken for token creation and authentication
const bcrypt = require('bcryptjs');                 // Import bcryptjs for password hash creation and password validation
const User = require('../models/User');             // Require the User model to create and find users in database

const { verifyToken } = require('../helpers/auth-helper');
const uploader = require('../helpers/multer-helper');

// POST route for user signup. Validate password length, hash the password, create the user in the database,
// if successful, send email for verification and a response with status 200, the user, token and success message,
// if unsuccessful, send a response with status 500 (Internal Server Error), the error and a message
router.post('/signup', (req, res, next) => {

  // Destructure the password in order to hash it before storing it in the database, and the usertype for model verification
  const { phone_number, password, confirm_password } = req.body;
  
  // Password length validation, min length 8, if not, respond with a 500 status and error message
  if ( password.length < 8 ) return res.status(500).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
  if ( password !== confirm_password ) return res.status(500).json({ msg: "Las contraseñas deben ser iguales" });

  // Use bcryptjs methods to generate salt and hash password, for storage with an extra level of security
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.findOne({phone_number}).exec( (error, user) => {
    if (user) {
      return res.status(401).json({ error, msg: 'Ya existe una cuenta asociada al número telefónico' });
    }
  
    User.create({ ...req.body, password: hashedPassword })
    .then( user => {          // Rename the found user document as "user"

      // Create a token with jwt: first parameter is data to be serialized into the token, second parameter
      // is app secret (used as key to create a token signature), third is a callback that passes the error or token
      jwt.sign({ id: user._id }, process.env.SECRET, (error, token) => {

        // Delete the password from the user document (returned by mongoose) before sending to front-end
        delete user._doc.password;

        // If there's an error creating the token, respond to the request with a 500 status, the error and a message
        if ( error ) return res.status(500).json({ error, msg: 'Error creando el token' });

        // Respond to the request with a 200 status, the user data and a success message
        res.status(200).json({ user, token, msg: 'Su usuario ha sido creado exitosamente, y ha iniciado sesión' });

      });
      
    })
    .catch( error => {
      
      if (error.code === 11000)
        res.status(500).json({ error, msg: 'Ya existe una cuenta asociada al correo electrónico' });
      // Respond with 500 status, the error and a message
      
      res.status(500).json({ error, msg: 'Error durante la creación del usuario' });
    
    });
  })
});

// POST route for user login. Validate password length, hash the password, create the user in the database,
// if successful, validate password, and send a response with 200 status, the user, token and success message,
// if unsuccessful, send a response with status 404 (Not found), the error and a message
router.post('/login', (req, res, next) => {

  const { phone_number, password } = req.body; // Destructure email, password and usertype from request body

  if ( phone_number.length !== 10 ) res.status(404).json({ msg: 'Teléfono inválido' });

  // Call mongoose findOne method, pass the email as query, if email exists, validate password and create token
  User.findOne({ phone_number })
  .then( user => {      

    // Verify if password sent is correct, true. If password is incorrect, false and send 401 status
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ msg: 'Contraseña incorrecta' });

    // Create a token with jwt: first parameter is data to be serialized into the token, second parameter
    // is app secret (used as key to create a token signature), third is a callback that passes the error or token
    jwt.sign({ id: user._id }, process.env.SECRET, (error, token) => {

      // Delete the password from the user document (returned by mongoose) before sending to front-end
      delete user._doc.password;

      // If there's an error creating the token, respond to the request with a 500 status, the error and a message
      if ( error ) return res.status(500).json({ error, msg: 'Error creando el token' });

      // Respond to the request with a 200 status, the user data and a success message
      res.status(200).json({ user, token, msg: 'Inicio de sesión exitoso' });

    });

  })
  .catch( error => {

    // Respond with 404 status, the error and a message
    res.status(404).json({ error, msg: 'Teléfono o contraseña incorrecta' });

  });
  
});

router.patch('/profile', verifyToken, uploader.single('profile_picture'), (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request
  const body  = req.body;               // Extract body from request

  // If a file is being uploaded, set the secure_url property in the secure_url variable
  if ( req.file ) {
    const secure_url = req.file.secure_url;
    body['profile_picture'] = secure_url;
  }

  // Find patient by id and update fields sent by the front-end in the request body and from multer helper
  User.findByIdAndUpdate( id, {$set: {...body}}, { new: true } )
  .then( user => {                    // Rename the found patient document as "user"

    delete user._doc.password;        // Delete password from user document before sending it

    res.status(200).json({ user });   // Respond with 200 status and updated user document

  })
  .catch( error => {

    console.log(error)
    res.status(500).json({ error, msg: 'Unable to update profile' }); // Respond 500 status, error and message

  });

});

module.exports = router;