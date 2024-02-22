import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Store } from '../Store';

const AddProductForm = () => {

  const { state} = useContext(Store);
  const { userInfo } = state; 



  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [rating, setRating] = useState('');
  const [numReviews, setNumReviews] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('countInStock', countInStock); // Corrected typo here
    formData.append('rating', rating);
    formData.append('numReviews', numReviews); // Corrected typo here
    formData.append('image', image);



    try {
      const response = await axios.post("http://localhost:5000/products/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Created successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    
    <form onSubmit={handleSubmit} className="max-w-screen-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
        Name
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="name"
        type="text"
        placeholder="Product Name"
        name="name"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
        Slug
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="slug"
        type="text"
        placeholder="Product Slug"
        name="slug"
        onChange={(e) => setSlug(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
        Brand
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="brand"
        type="text"
        placeholder="Product Brand"
        name="brand"
        onChange={(e) => setBrand(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
        Category
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="category"
        type="text"
        placeholder="Product Category"
        name="category"
        onChange={(e) => setCategory(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
        Description
      </label>
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="description"
        placeholder="Product Description"
        name="description"
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
        Price
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="price"
        type="number"
        placeholder="Product Price"
        name="price"
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="countInStock">
        Count in Stock
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="countInStock"
        type="number"
        placeholder="Count in Stock"
        name="countInStock"
        onChange={(e) => setCountInStock(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
        Rating
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="rating"
        type="number"
        placeholder="Product Rating"
        name="rating"
        onChange={(e) => setRating(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numReviews">
        Number of Reviews
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="numReviews"
        type="number"
        placeholder="Number of Reviews"
        name="numReviews"
        onChange={(e) => setNumReviews(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
        Image
      </label>
      <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="image"
        type="file"
        name="image"
        onChange={(e) => setImage(e.target.value)}
      />
    </div>
    <div className="mb-2 ">
      <button
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Add Product
      </button>
    </div>
  </form>
  
  );
};

export default AddProductForm;
