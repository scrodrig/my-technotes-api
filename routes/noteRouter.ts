import express from 'express';
const router = express.Router();
const noteController = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);
router
    .route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;
