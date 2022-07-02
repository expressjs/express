var isEmptyString = function (str) {
    return str === undefined || str === null || str.trim() === ''
}
var throwIfEmpty = function (str, field) {
    if (isEmptyString(str))
        throw new Error("field '" + field + "' should not be empty")
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


    setId(id) {
        this.id = id;
    }


    setTitle(title) {
        throwIfEmpty(title, 'title')
        this.title = title;
    }


    setContent(content) {
        this.content = content;
    }


    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }


    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }
}