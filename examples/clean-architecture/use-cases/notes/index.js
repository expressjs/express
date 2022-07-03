/**
 * Since this is just a simple CRUD, I'm only calling the underlying repository methods.
 * In a real world application, in the same use-case method, you will insert the entire business logic.
 */

function NotesUseCase(notesRepository) {
  this.notesRepository = notesRepository;
}

NotesUseCase.prototype.getAll = function() {
  return this.notesRepository.getAll();
};

NotesUseCase.prototype.getById = function(id) {
  return this.notesRepository.getById(id);
};

NotesUseCase.prototype.create = function(note) {
  //Add here other business logic...
  return this.notesRepository.create(note);
};

NotesUseCase.prototype.updateById = function(id, title, content) {
  return this.notesRepository.updateById(id, title, content);
};

NotesUseCase.prototype.delete = function(id) {
  return this.notesRepository.deleteById(id);
};

module.exports = NotesUseCase;
