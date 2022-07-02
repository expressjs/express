function NotesRepository() {
  //Really simple in-memory database
  this.notes = [];
  this.autoIncrementID = 0;
}

NotesRepository.prototype.getAll = function() {
  return this.notes;
};

NotesRepository.prototype.getById = function(id) {
  var result = this.notes.find(function(note) {
    return note.id === id;
  });
  if (typeof result === "undefined") {
    throw new Error("Note not found");
  }
  return result;
};

NotesRepository.prototype.create = function(note) {
  note.setId(this.autoIncrementID);
  note.setCreatedAt(new Date());
  note.setUpdatedAt(new Date());
  this.autoIncrementID++;

  this.notes.push(note);

  return note;
};

NotesRepository.prototype.deleteById = function(id) {
  var index = this.notes.findIndex(function(note) {
    return note.id === id;
  });
  if (index === -1) {
    throw new Error("Note not found");
  }
  this.notes.splice(index, 1);
};

NotesRepository.prototype.updateById = function(id, title, content) {
  var index = this.notes.findIndex(function(note) {
    return note.id === id;
  });
  if (index === -1) {
    throw new Error("Note not found");
  }
  this.notes[index].setTitle(title);
  this.notes[index].setContent(content);
  this.notes[index].setUpdatedAt(new Date());
};

module.exports = NotesRepository;
