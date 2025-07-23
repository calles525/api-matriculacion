const express = require('express');
const router = express.Router();
const convencionistaController = require('../controllers/convencionistaController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', /*authenticateToken,*/ convencionistaController.create);
router.post('/2', /*authenticateToken,*/ convencionistaController.create2);
router.get('/', /*authenticateToken,*/ convencionistaController.getByZona);
router.get('/2', /*authenticateToken,*/ convencionistaController.getByZona2);
router.get('/estadisticas', /*authenticateToken,*/ convencionistaController.getStats);

module.exports = router;