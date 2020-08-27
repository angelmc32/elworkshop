const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/all', (req, res, next) => {

  Job.find()
  .sort({date: -1})
  .then( jobs => {

    res.status(200).json({ jobs });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Ocurrió un error. Intenté más tarde.' }); // Respond 500 status, error and message

  });

});

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Job.find({ user: id })
  .sort({date: -1})
  .then( jobs => {

    res.status(200).json({ jobs });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Ocurrió un error. Intenté más tarde.' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;
  Job.create({ ...req.body, user: id })
  .then( job => {

    res.status(200).json({ job });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible crear la chambita' }); // Respond 500 status, error and message

  });

})

router.get('/:jobID', (req, res, next) => {

  const { jobID } = req.params;

  Job.findById(jobID)
  .then( job => {

    res.status(200).json({ job });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible encontrar la chambita' }); // Respond 500 status, error and message

  });

});

router.patch('/:jobID', verifyToken, (req, res, next) => {

  const { jobID } = req.params;
  

  Job.findByIdAndUpdate(jobID, { $set: { ...req.body } }, { new: true} )
  .then( job => {

    res.status(200).json({ job });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible actualizar la chambita. Intente de nuevo más tarde.' }); // Respond 500 status, error and message

  });

});

router.delete('/:jobID', verifyToken, (req, res, next) => {

  const { jobID } = req.params;

  Job.findByIdAndDelete(jobID)
  .then( job => {

    res.status(200).json({ job });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible eliminar la chambita. Intente de nuevo más tarde.' }); // Respond 500 status, error and message

  });

});

module.exports = router;