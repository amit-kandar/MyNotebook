import { React, useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const Noteitem=(props)=> {
    const context = useContext(noteContext)
    const { deleteNote } = context
    const { note, updateNote } = props
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="far fa-trash-alt mx-3" onClick={()=>{deleteNote(note._id); props.showAlert("success", "Successfully Deleted")}}></i>
                        <i className="far fa-edit" onClick={()=>{updateNote(note)}}></i>
                    </div>
                    <p className="card-text h7">{note.description}</p>
                    <h6 className="card-text">{note.tag}</h6>
                </div>
            </div>
        </div>
    )
}

export default Noteitem