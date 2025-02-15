const express = require('express');
const multer = require('multer');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', historyController.getAllHistoryEvents);
router.get('/:id', historyController.getHistoryEventById);
router.post('/', upload.single('img'), historyController.createHistoryEvent);
router.put('/:id', upload.single('img'), historyController.updateHistoryEvent);
router.delete('/:id', historyController.deleteHistoryEvent);

module.exports = router;