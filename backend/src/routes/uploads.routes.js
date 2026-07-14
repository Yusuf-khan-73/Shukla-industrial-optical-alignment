const express = require('express');
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const uploadsController = require('../controllers/uploadsController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  authenticate,
  upload.single('file'),
  uploadsController.uploadImage
);

module.exports = router;
