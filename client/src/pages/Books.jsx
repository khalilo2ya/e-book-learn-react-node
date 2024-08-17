import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Books = () => {
  const [books, setBooks] = useState([]);

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get('http://localhost:8800/books');
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8800/books/${id}`);
          fetchAllBooks(); // Refresh the list after deletion
          Swal.fire(
            'Supprimé!',
            'Le livre a été supprimé avec succès.',
            'success'
          );
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  return (
    <div>
      {/* <h1>Book Shop</h1> */}
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && (
              <img
                src={`http://localhost:8800${book.cover}`}
                alt={book.title}
                style={{ width: '200px', height: '300px', objectFit: 'cover' }}
              />
            )}
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
            <span>{book.price} TND</span>
            <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
            <button className="update">
              <Link to={`/update/${book.id}`}>Update</Link>
            </button>
          </div>
        ))}
      </div>
      {/* <button><Link to="/add">Add new Book</Link></button> */}
    </div>
  );
};

export default Books;
