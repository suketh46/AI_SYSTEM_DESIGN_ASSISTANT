const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getModules, getModule, getLesson, completeLesson, getProgress,
  getTemplates, getTemplate, getPlaygroundExercises,
} = require('../controllers/learningController');

const router = Router();

router.use(authenticate);

router.get('/modules', getModules);
router.get('/modules/:moduleId', getModule);
router.get('/modules/:moduleId/lessons/:lessonId', getLesson);
router.post('/complete', completeLesson);
router.get('/progress', getProgress);
router.get('/templates', getTemplates);
router.get('/templates/:templateId', getTemplate);
router.get('/playground', getPlaygroundExercises);

module.exports = router;
