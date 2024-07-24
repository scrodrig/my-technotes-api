import { Request, Response } from "express"

const Note = require('../models/Note')
const User = require('../models/User')

// @desc    Get all notes
// @route   GET /notes
// @access  Private

const getAllNotes = async (req: Request, res: Response) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(404).json({ message: 'No notes found' })
    }

    const notesWithUser = await Promise.all(notes.map(async (note: { user: any }) => {
        const user = await User.findById(note?.user).lean().exec()
        //! If user is not found, return 'unknown' as username
        return { ...note, username: user?.username ?? 'unknown' }
    }))

    res.json(notesWithUser)
}

// @desc    Create New Note
// @route   POST /notes
// @access  Private
const createNewNote = async (req: Request, res: Response) => {
    const { user, title, text } = req.body

    //Confirm data
    if (!user || !title) {
        return res.status(400).json({ message: 'All fields are requiered' })
    }

    //Check for duplicates
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Note already exists' })
    }

    //Create new note
    const note = await Note.create({ user, title, text })

    if (note) {
        res.status(201).json({
            message: `New note ${title} created`
        })
    } else {
        res.status(400).json({ message: 'Invalid note data received' })
    }
}

// @desc    Update Note
// @route   PATCH /notes
// @access  Private
const updateNote = async (req: Request, res: Response) => {
    const { id, completed, user, title, text } = req.body

    //Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are requiered' })
    }

    //Check note exists
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    //* Check for duplicates

    const duplicated = await Note.findOne({ title }).lean().exec()

    //* Allow update if it is the same note
    if (duplicated && duplicated?._id.toString() !== id) {
        return res.status(409).json({ message: 'Note already exists' })
    }

    //Update note
    note.title = title
    note.text = text
    note.completed = completed
    note.user = user

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)

}

// @desc    Delete Note
// @route   DELETE /notes
// @access  Private
const deleteNote = async (req: Request, res: Response) => {
    const { id } = req.body

    //Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    //Check note exists
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    //Delete note
    const result = await note.deleteOne()

    const reply = `Note '${note.title}' with ID ${note._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}