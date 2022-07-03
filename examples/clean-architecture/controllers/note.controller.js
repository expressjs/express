var path = require("path");
var Note = require(path.join(__dirname, "..", "entities", "note.entity"));

module.exports = class NoteController {
  constructor(noteUseCase) {
    this.noteUseCase = noteUseCase;
  }

  async getAll(req, res) {
    try {
      var notes = await this.noteUseCase.getAll();
      res.json(notes);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async getById(req, res) {
    var { id } = req.params;
    try {
      var noteId = parseInt(id);
      var note = await this.noteUseCase.getById(noteId);
      res.json(note);
    } catch (error) {
      res.status(404).json(error.message);
    }
  }

  async create(req, res) {
    var { title, content } = req.body;

    try {
      var note = new Note(title, content);
      var createdNote = await this.noteUseCase.create(note);
      res.status(201).json(createdNote);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async update(req, res) {
    var { title, content } = req.body;
    var { id } = req.params;
    try {
      var noteId = parseInt(id);
      await this.noteUseCase.updateById(noteId, title, content);
      res.json("Note updated");
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  async delete(req, res) {
    var { id } = req.params;

    try {
      var noteId = parseInt(id);
      await this.noteUseCase.delete(noteId);
      res.json("Note deleted");
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
};
