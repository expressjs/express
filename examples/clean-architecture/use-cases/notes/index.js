/**
 * Since this is just a simple CRUD, I'm only calling the underlying repository methods.
 * In a real world application, in the same use-case method, you will insert the entire business logic.
 */

function NotesService(notesRepository) {
  this.notesRepository = notesRepository;
}

NotesService.prototype.getAll = function() {
  return this.notesRepository.getAll();
};

NotesService.prototype.getById = function(id) {
  return this.notesRepository.getById(id);
};

NotesService.prototype.create = function(note) {
  //Add here other business logic...
  return this.notesRepository.create(note);
};

NotesService.prototype.updateById = function(id, title, content) {
  return this.notesRepository.updateById(id, title, content);
};

NotesService.prototype.delete = function(id) {
  return this.notesRepository.deleteById(id);
};

module.exports = NotesService;
