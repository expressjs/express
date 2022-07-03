'use strict';
/**
 * Since this is just a simple CRUD, I'm only calling the underlying repository methods.
 * In a real world application, in the same use-case method, you will insert the entire business logic.
 */

module.exports = class NotesUseCase {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }

  async getAll() {
    return this.notesRepository.getAll();
  }

  async getById(id) {
    return this.notesRepository.getById(id);
  }

  async create(note) {
    //Add here other business logic...
    return this.notesRepository.create(note);
  }

  async updateById(id, title, content) {
    return this.notesRepository.updateById(id, title, content);
  }

  async delete(id) {
    return this.notesRepository.deleteById(id);
  }
};
