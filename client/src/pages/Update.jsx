import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Update = () => {

  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
  });
  const [cover, setCover] = useState(null); // Separate state for the cover image

  const navigate = useNavigate();
  const location = useLocation();
  const bookId = location.pathname.split("/")[2];

  const fetchBookByID = async (id) => {
    try {
      const res = await axios.get('http://localhost:8800/books/' + id);
      setBook({
        title: res.data[0].title,
        desc: res.data[0].desc,
        price: res.data[0].price,
      });
      setCover(res.data[0].cover); // Set the existing cover path
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookByID(bookId);
  }, [bookId]);

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setCover(e.target.files[0]); // Handle file selection for the cover
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("desc", book.desc);
    formData.append("price", book.price);
    if (typeof cover === 'object') { // Check if a new image file is selected
      formData.append("cover", cover);
    } else {
      formData.append("cover", cover); // Retain the existing cover path if no new file is uploaded
    }

    try {
      await axios.put("http://localhost:8800/books/" + bookId, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <h1>Update Book</h1>
      <input
        type="text"
        placeholder="Title"
        name="title"
        onChange={handleChange}
        value={book.title}
      />
      <input
        type="text"
        placeholder="Description"
        name="desc"
        onChange={handleChange}
        value={book.desc}
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        onChange={handleChange}
        value={book.price}
      />

      {/* Display the current cover image */}
      {cover && typeof cover === 'string' && (
        <div>
          <img src={`http://localhost:8800${cover}`} alt="Book Cover" style={{ width: '200px', height: '300px', objectFit: 'cover', marginBottom: '20px' }} />
        </div>
      )}

      <input
        type="file"
        onChange={handleFileChange} // Handle file input change
      />
      <button onClick={handleClick}>Update the book</button>
    </div>
  );
};

export default Update;
