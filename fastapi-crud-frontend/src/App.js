import React, { useState, useEffect } from 'react';

const API_URL = "http://127.0.0.1:8000/items/";

function App() {
    const [items, setItems] = useState([])
    const [form, setForm] = useState({ name: '', description: '', price: '' });

    useEffect(() => {
        fetch(API_URL)
          .then(res => res.json())
          .then(data => setItems(data))
          .catch(err => console.error("Error fetching items:", err));
      }, []);
    
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = e => {
      e.preventDefault();
    
      const newItem = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price)
      };
    
      fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
        .then(res => res.json())
        .then(data => {
          setItems([...items, data]); // just push the new object
          setForm({ name: '', description: '', price: '' });
        })
        .catch(err => console.error("Error posting item:", err));
    };

    const handleDelete = id => {
      fetch(`${API_URL}${id}`, { method: 'DELETE' })
        .then(() => setItems(items.filter(item => item.id !== id)))
        .catch(err => console.error("Error deleting item:", err));
    };
    

      return (
        <div style={{ padding: 20 }}>
          <h1>FastAPI CRUD - Items</h1>
    
          <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <ul>
           <li> <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /> </li>
            <li><input name="description" placeholder="Description" value={form.description} onChange={handleChange} required /> </li>
            <li><input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required /></li>
            </ul>
            <button type="submit">Add Item</button>
          </form>
    
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> — {item.description} (${item.price})
                <button onClick={() => handleDelete(parseInt(item.id))} style={{ marginLeft: 10 }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

export default App;
