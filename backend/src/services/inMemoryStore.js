const crypto = require('crypto');

/**
 * Simple in-memory data store for users and architecture history.
 * Replace with MongoDB/PostgreSQL in production.
 */
class InMemoryStore {
  constructor() {
    this.users = [];
    this.architectures = [];
    this.progress = {};
  }

  /* ---------- Learning Progress ---------- */

  getProgress(userId) {
    return this.progress[userId] || { completedLessons: [], quizScores: {}, playgroundExercises: [] };
  }

  saveProgress(userId, progress) {
    this.progress[userId] = progress;
    return progress;
  }

  /* ---------- Users ---------- */

  createUser({ name, email, password }) {
    const exists = this.users.find((u) => u.email === email);
    if (exists) return null;
    const user = { id: crypto.randomUUID(), name, email, password, createdAt: new Date().toISOString() };
    this.users.push(user);
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  }

  findByEmail(email) {
    return this.users.find((u) => u.email === email) || null;
  }

  findById(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  /* ---------- Architectures ---------- */

  saveArchitecture({ userId, prompt, title, data }) {
    const record = {
      id: crypto.randomUUID(),
      userId,
      prompt,
      title,
      data,
      createdAt: new Date().toISOString(),
    };
    this.architectures.push(record);
    return record;
  }

  listArchitectures(userId) {
    return this.architectures
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(({ id, userId: _, ...rest }) => ({ id, ...rest }));
  }

  getArchitecture(userId, archId) {
    const record = this.architectures.find((a) => a.id === archId && a.userId === userId);
    if (!record) return null;
    const { userId: _, ...rest } = record;
    return rest;
  }

  deleteArchitecture(userId, archId) {
    const idx = this.architectures.findIndex((a) => a.id === archId && a.userId === userId);
    if (idx === -1) return false;
    this.architectures.splice(idx, 1);
    return true;
  }
}

module.exports = new InMemoryStore();
