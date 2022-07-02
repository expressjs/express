const path = require("path")
const Note = require(path.join(__dirname, '..', 'entities', 'note.entity'));

module.exports = class NoteController {
    constructor(noteUseCase) {
        this.noteUseCase = noteUseCase;
    }

    async getAll(req, res) {
        try {
            const notes = await this.noteUseCase.getAll();
            res.json(notes)
        } catch (error) {
            res.status(400).json(error.message)
        }
    }

    async getById(req, res) {
        const { id } = req.params
        try {
            const noteId = parseInt(id)
            const note = await this.noteUseCase.getById(noteId);
            res.json(note)
        } catch (error) {
            res.status(400).json(error.message)
        }
    }

    async create(req, res) {
        const { title, content } = req.body

        try {
            const note = new Note(title, content);
            const createdNote = await this.noteUseCase.create(note);
            res.status(201).json(createdNote)
        } catch (error) {
            res.status(400).json(error.message)
        }

    }

    async update(req, res) {
        const { title, content } = req.body
        const { id } = req.params
        try {
            const noteId = parseInt(id)
            await this.noteUseCase.updateById(noteId, title, content)
            res.json("Note updated")
        } catch (error) {
            res.status(400).json(error.message)
        }
    }

    async delete(req, res) {
        const { id } = req.params

        try {
            const noteId = parseInt(id)
            await this.noteUseCase.delete(noteId);
            res.json("Note deleted")
        } catch (error) {
            res.status(400).json(error.message)
        }

    }
}