const express = require('express');
const router = express.Router();
const convencionistaController = require('../controllers/convencionistaController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', /*authenticateToken,*/ convencionistaController.create);
router.get('/', /*authenticateToken,*/ convencionistaController.getByZona);
router.get('/estadisticas', /*authenticateToken,*/ convencionistaController.getStats);

module.exports = router;