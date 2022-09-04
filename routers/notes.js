const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const notes_validation = require('../controller/notes_validation');

//Router 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/getnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// Router 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //validate Input
        const { error } = notes_validation.validate(req.body)
        if (error) {
            return res.status(400).send(error.message)
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        //save in mongodb 
        const savedNote = await note.save()
        res.status(201).json(savedNote)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// Router 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        //Create new notes
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to be update and update the note
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }

        //User authentication 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// Router 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //Find the note to be delete and delete the note
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }

        //User authentication 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router