const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Client = require('../models/Client')

router.get('/', (req, res) => res.render('indexi'));
router.get('/about', (req, res) => res.render('about'));
router.get('/news', (req, res) => res.render('news'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/track', (req, res) => res.render('track'));


// @desc    Dashboard
// @route   get /dashboard

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
      const clients = await Client.find({ user: req.user.id }).lean()
      res.render('dashboard', {
          name: req.user.name,
          clients
      })
  } catch (err) {
      console.error(err)
      res.render('error/500')
  }
})


module.exports = router;