const path = require("path")
const router = require('../../..').Router();

//Database connection (you can change it to use a different database)
const NotesRepository = require(path.join(__dirname, '..', 'repositories', 'note.repository'));

//Controller class to handle express requests
const NotesController = require(path.join(__dirname, '..', 'controllers', 'note.controller'));

//Business logic class
const NotesUseCase = require(path.join(__dirname, '..', 'use-cases', 'notes'));

const db = new NotesRepository()
const businessLogic = new NotesUseCase(db)
const controller = new NotesController(businessLogic)


router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.patch('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));


module.exports = router;