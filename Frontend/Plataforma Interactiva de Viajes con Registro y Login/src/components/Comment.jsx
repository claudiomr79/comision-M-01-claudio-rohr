import React from 'react'
import { useState, useEffect } from 'react'
import './Comment.css'


function Comment() {

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    //harcodeado para ver si funciona
    useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/comments')
        .then(response => response.json())
        .then(data => {
          setComments(data)
          setLoading(false)
        })
        .catch(error => {
          setError(error)
          setLoading(false)
        })
    }, []) 
  return (
    <>
      <div id='comment'>
        <h1>Comments</h1>
        <ul>
            {comments.map(comment => (
            <li key={comment.id}><strong>{comment.email}</strong> <span style={{color: 'blue'}}> {comment.name} </span>: {comment.body}
            </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default Comment