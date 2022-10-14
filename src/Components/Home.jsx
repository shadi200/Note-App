import { useEffect, useState } from 'react';
import jwt_Decode from 'jwt-decode';
import axios from 'axios'
import Swal from 'sweetalert2';



export default function Home() {
  let baseURL = 'https://route-egypt-api.herokuapp.com/'
  let token = localStorage.getItem('token')
  let userDecoded = jwt_Decode(token)
  let userID = userDecoded._id
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState({ 'title': '', 'desc': '', userID, token })

  async function getUserNotes() {
    let { data } = await axios.get(baseURL + "getUserNotes", {
      headers: {
        userID,
        Token: token
      }
    })
    if (data.message == 'success') {
      setNotes(data.Notes)

    }
    console.log(notes);
  }

  useEffect(() => {
    getUserNotes()
  }, [])
  function getNote({ target }) {
    setNote({ ...note, [target.name]: target.value })
  }
  console.log(note);
  async function addNote(e) {
    e.preventDefault()
    let { data } = await axios.post(baseURL + 'addNote', note)
    console.log(data);
    if (data.message == 'success') {
      document.getElementById('add-form').reset()
      getUserNotes()
    }

  }


  function deleteNote(NoteID) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(baseURL + 'deleteNote', {
          data: {
            NoteID,
            token
          }
        }).then((response) => {
          console.log(response);
          if (response.data.message == 'deleted') {
            getUserNotes();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message,
            })
          }
        })
      }
    })
  }


  function getNoteID(NoteIndex) {
    console.log(notes[NoteIndex]);
    document.querySelector('#exampleModal1 input').value = notes[NoteIndex].title
    document.querySelector('#exampleModal1 textarea').value = notes[NoteIndex].desc
    setNote({ ...note, 'title': notes[NoteIndex].title, 'desc': notes[NoteIndex].desc, NoteID: notes[NoteIndex]._id })
  }
  async function updateNote(e) {
    e.preventDefault()
    
    let { data } = await axios.put(baseURL + 'updateNote', note)
    console.log(data);
    if (data.message == 'updated') {
      getUserNotes()
      Swal.fire(
        'updated!',
        'Your file has been deleted.',
        'success'
      )
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }

  return (
    <div>
      <section>
        <div className="container my-5">
          <div className="col-md-12 text-end">
            <a className="add p-2 btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add
              New</a>
          </div>
        </div>

        {/* Add Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <form id="add-form" onSubmit={addNote}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                  <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                  <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Edit Modal */}
        <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <form onSubmit={updateNote} id="edit-form">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                  <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                  <button data-bs-dismiss="modal" type="submit" className="btn btn-info">Update Note</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="container">
          <div className="row">
            {notes.map((note, index) => {
              return (
                <div key={index} className="col-md-4 my-4">
                  <div className="note p-4">
                    <h3 className="float-start">{note.title}</h3>
                    <a onClick={() => { getNoteID(index) }} data-bs-toggle="modal" data-bs-target="#exampleModal1" ><i className="fas fa-edit float-end edit"></i></a>
                    <a onClick={() => { deleteNote(note._id) }} > <i className="fas fa-trash-alt float-end px-3 del"></i></a>
                    <span className="clearfix"></span>
                    <p>{note.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
