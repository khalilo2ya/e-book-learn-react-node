import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null
  });
  const [cover, setCover] = useState(null); // Separate state for the cover image

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setCover(e.target.files[0]); // Get the selected file
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("desc", book.desc);
    formData.append("price", book.price);
    formData.append("cover", cover); // Append the file to the form data

    try {
      await axios.post("http://localhost:8800/books", formData, {
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
      <h1>Add New Book</h1>
      <input
        type="text"
        placeholder="Title"
        name="title"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Description"
        name="desc"
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        onChange={handleChange}
      />
      <input
        type="file"
        placeholder="Cover"
        onChange={handleFileChange} // Handle file input
      />
      <button onClick={handleClick}>Add</button>
    </div>
  );
};

export default Add;
