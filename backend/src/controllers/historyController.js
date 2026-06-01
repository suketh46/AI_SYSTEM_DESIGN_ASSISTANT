const store = require('../services/inMemoryStore');

function list(req, res) {
  const items = store.listArchitectures(req.user.id);
  return res.json({ success: true, data: items });
}

function get(req, res) {
  const arch = store.getArchitecture(req.user.id, req.params.id);
  if (!arch) {
    return res.status(404).json({ success: false, error: 'Architecture not found' });
  }
  return res.json({ success: true, data: arch });
}

function save(req, res) {
  const { prompt, title, data, codeDocs } = req.body || {};
  if (!prompt || !title || !data) {
    return res.status(400).json({ success: false, error: 'prompt, title, and data are required' });
  }
  const record = store.saveArchitecture({ userId: req.user.id, prompt, title, data, codeDocs });
  return res.status(201).json({ success: true, data: record });
}

function remove(req, res) {
  const deleted = store.deleteArchitecture(req.user.id, req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Architecture not found' });
  }
  return res.json({ success: true, data: null });
}

module.exports = { list, get, save, remove };
