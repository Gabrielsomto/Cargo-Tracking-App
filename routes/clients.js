const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth');

const Client = require('../models/Client')

// @desc    Show add page
// @route   GET /clients/add
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('clients/add')
})

// @desc    Process add form
// @route   POST /clients
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Client.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const clients = await Client.find({ status: 'on route' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('clients/index', {
      clients,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id',  ensureAuthenticated, async (req, res) => {
  try {
    let client = await Client.findById(req.params.id).populate('user').lean()

    if (!client) {
      return res.render('error/404')
    }

    if (client.user._id != req.user.id && client.status == 'arrived') {
      res.render('error/404')
    } else {
      res.render('clients/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id',  ensureAuthenticated, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
    }).lean()

    if (!client) {
      return res.render('error/404')
    }

    if (client.user != req.user.id) {
      res.redirect('/clients')
    } else {
      res.render('clients/edit', {
        client,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id',  ensureAuthenticated, async (req, res) => {
  try {
    let client = await Client.findById(req.params.id).lean()

    if (!client) {
      return res.render('error/404')
    }

    if (client.user != req.user.id) {
      res.redirect('/clients')
    } else {
      client = await Client.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id',  ensureAuthenticated, async (req, res) => {
  try {
    let client = await Client.findById(req.params.id).lean()

    if (!client) {
      return res.render('error/404')
    }

    if (client.user != req.user.id) {
      res.redirect('/clients')
    } else {
      await Client.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId',  ensureAuthenticated, async (req, res) => {
  try {
    const clientss = await Client.find({
      user: req.params.userId,
      status: 'on route',
    })
      .populate('user')
      .lean()

    res.render('clients/index', {
      clients,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router