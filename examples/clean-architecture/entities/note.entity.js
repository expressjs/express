const isEmptyString = (str) => str === undefined || str === null || str.trim() === ''
const throwIfEmpty = (str, field) => {
    if (isEmptyString(str))
        throw new Error(`field '${field}' should not be empty`)
}

module.exports = class Note {
    constructor(title, content,
        createdAt = new Date(),
        updatedAt = new Date(),
        id = null) {

        throwIfEmpty(title, 'title')

        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        throwIfEmpty(title, 'title')
        this.title = title;
    }

    getContent() {
        return this.content;
    }

    setContent(content) {
        this.content = content;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }
}