const { asyncHandler } = require('../middleware/errorHandler');
const { saveUploadBuffer } = require('../utils/uploads');

const uploadImage = asyncHandler(async (req, res) => {
  const folder = req.query.folder || req.body.folder || 'images';
  const url = saveUploadBuffer(req.file, folder);
  res.json({
    url,
    filename: url.split('/').pop(),
  });
});

module.exports = {
  uploadImage,
};
