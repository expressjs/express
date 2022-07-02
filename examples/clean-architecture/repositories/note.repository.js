module.exports = class NotesRepository {
    constructor() {
        //Really simple in-memory database
        this.notes = [];
        this.autoIncrementID = 0
    }

    async getAll() {
        return this.notes;
    }

    async getById(id) {
        console.log("Finding with id => ", id)
        console.log(typeof id)
        const result = this.notes.find(note => note.id === id);
        if(typeof result === "undefined"){
            throw new Error("Note not found")
        }
        return result
    }

    async create(note) {
        note.setId(this.autoIncrementID)
        note.setCreatedAt(new Date())
        note.setUpdatedAt(new Date())
        this.autoIncrementID++

        this.notes.push(note);

        return note
    }

    async deleteById(id) {
        const index = this.notes.findIndex(note => note.id === id);
        if(index === -1){
            throw new Error("Note not found")
        }
        this.notes.splice(index, 1);
    }

    async updateById(id, title, content) {
        const index = this.notes.findIndex(note => note.id === id);
        if(index === -1){
            throw new Error("Note not found")
        }
        this.notes[index].setTitle(title)
        this.notes[index].setContent(content)
        this.notes[index].setUpdatedAt(new Date())
    }
}