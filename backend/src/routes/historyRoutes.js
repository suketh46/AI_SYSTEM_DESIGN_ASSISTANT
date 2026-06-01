const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { list, get, save, remove } = require('../controllers/historyController');

const router = Router();

router.use(authenticate);

router.get('/', list);
router.get('/:id', get);
router.post('/', save);
router.delete('/:id', remove);

module.exports = router;
