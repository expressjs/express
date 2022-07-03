var path = require("path");
var Note = require(path.join(__dirname, "..", "entities", "note.entity"));

function NoteController(noteUseCase) {
  this.noteUseCase = noteUseCase;
}

NoteController.prototype.getAll = function (req, res) {
  var notes = this.noteUseCase.getAll();
  res.json(notes);
};

NoteController.prototype.getById = function (req, res) {
  try {
    var noteId = parseInt(req.params.id);
    var note = this.noteUseCase.getById(noteId);
    res.json(note);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

NoteController.prototype.create = function (req, res) {
  try {
    var note = new Note(req.body.title, req.body.content);
    var createdNote = this.noteUseCase.create(note);
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

NoteController.prototype.update = function (req, res) {
  try {
    var noteId = parseInt(req.params.id);
    this.noteUseCase.updateById(noteId, req.body.title, req.body.content);
    res.json("Note updated");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

NoteController.prototype.delete = function (req, res) {
  try {
    var noteId = parseInt(req.params.id);
    this.noteUseCase.delete(noteId);
    res.json("Note deleted");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = NoteController;
