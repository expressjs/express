'use strict';
var path = require("path")
var router = require('../../..').Router();

//Database connection (you can change it to use a different database)
var NotesRepository = require(path.join(__dirname, '..', 'repositories', 'note.repository'));

//Controller class to handle express requests
var NotesController = require(path.join(__dirname, '..', 'controllers', 'note.controller'));

//Business logic class
var NotesUseCase = require(path.join(__dirname, '..', 'use-cases', 'notes'));

var db = new NotesRepository()
var businessLogic = new NotesUseCase(db)
var controller = new NotesController(businessLogic)


router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.patch('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));


module.exports = router;
