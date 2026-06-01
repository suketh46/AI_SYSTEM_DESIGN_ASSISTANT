const { Router } = require('express');
const { generateArchitecture, listModels, generateCode } = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/models', listModels);
router.post('/generate-architecture', generateArchitecture);
router.post('/generate-code', authenticate, generateCode);

module.exports = router;
