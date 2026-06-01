const { modules, templates, playgroundExercises } = require('../services/lessonContent');
const store = require('../services/inMemoryStore');

function getModules(req, res) {
  const public = modules.map(({ id, title, description, difficulty, estimatedMinutes, lessons }) => ({
    id, title, description, difficulty, estimatedMinutes,
    lessons: lessons.map(({ id, title }) => ({ id, title })),
  }));
  return res.json({ success: true, data: public });
}

function getModule(req, res) {
  const mod = modules.find((m) => m.id === req.params.moduleId);
  if (!mod) return res.status(404).json({ success: false, error: 'Module not found' });
  const progress = store.getProgress(req.user.id);
  const completedLessons = progress.completedLessons || [];
  const quizScores = progress.quizScores || {};
  const enhanced = {
    ...mod,
    lessons: mod.lessons.map((l) => ({
      ...l,
      completed: completedLessons.includes(l.id),
      quizScore: quizScores[l.id] || null,
    })),
  };
  return res.json({ success: true, data: enhanced });
}

function getLesson(req, res) {
  const mod = modules.find((m) => m.id === req.params.moduleId);
  if (!mod) return res.status(404).json({ success: false, error: 'Module not found' });
  const lesson = mod.lessons.find((l) => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });
  const progress = store.getProgress(req.user.id);
  return res.json({
    success: true,
    data: {
      ...lesson,
      completed: (progress.completedLessons || []).includes(lesson.id),
      quizScore: (progress.quizScores || {})[lesson.id] || null,
    },
  });
}

function completeLesson(req, res) {
  const { lessonId, quizScore } = req.body || {};
  if (!lessonId) return res.status(400).json({ success: false, error: 'lessonId is required' });
  const progress = store.getProgress(req.user.id);
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  if (typeof quizScore === 'number') {
    progress.quizScores[lessonId] = quizScore;
  }
  store.saveProgress(req.user.id, progress);
  return res.json({ success: true, data: progress });
}

function getProgress(req, res) {
  const progress = store.getProgress(req.user.id);
  const total = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  return res.json({
    success: true,
    data: {
      ...progress,
      totalLessons: total,
      completedCount: (progress.completedLessons || []).length,
    },
  });
}

function getTemplates(req, res) {
  return res.json({ success: true, data: templates });
}

function getTemplate(req, res) {
  const tpl = templates.find((t) => t.id === req.params.templateId);
  if (!tpl) return res.status(404).json({ success: false, error: 'Template not found' });
  return res.json({ success: true, data: tpl });
}

function getPlaygroundExercises(req, res) {
  return res.json({ success: true, data: playgroundExercises });
}

module.exports = { getModules, getModule, getLesson, completeLesson, getProgress, getTemplates, getTemplate, getPlaygroundExercises };
