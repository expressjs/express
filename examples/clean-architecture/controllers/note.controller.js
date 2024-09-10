var Note = require("../entities/note.entity");

/**
 * Please, note that here I'm not using ES6 classes just for compatibility purposes
 * In a real-world application, you should use ES6 classes
 */
function NoteController(noteUseCase) {
  this.noteUseCase = noteUseCase;
}

NoteController.prototype.getAll = function (req, res) {
  var notes = this.noteUseCase.getAll();
  res.json(notes);
};

NoteController.prototype.getById = function (req, res) {
  var noteId = parseInt(req.params.id);
  var note = this.noteUseCase.getById(noteId);
  res.json(note);
};

NoteController.prototype.create = function (req, res) {
  var note = new Note(req.body.title, req.body.content);
  var createdNote = this.noteUseCase.create(note);
  res.status(201).json(createdNote);
};

NoteController.prototype.update = function (req, res) {
  var noteId = parseInt(req.params.id);
  this.noteUseCase.updateById(noteId, req.body.title, req.body.content);
  res.json("Note updated");
};

NoteController.prototype.delete = function (req, res) {
  var noteId = parseInt(req.params.id);
  this.noteUseCase.delete(noteId);
  res.json("Note deleted");
};

module.exports = NoteController;
