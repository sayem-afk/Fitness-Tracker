import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('exercises');
  const [exercises, setExercises] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Check if user is admin (you can modify this logic)
  const isAdmin = user && user.email === 'admin@fitnesstracker.com';

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [activeTab, isAdmin]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      switch (activeTab) {
        case 'exercises':
          const exercisesRes = await axios.get('http://localhost:5000/api/exercises');
          setExercises(exercisesRes.data);
          break;
        case 'blogs':
          const blogsRes = await axios.get('http://localhost:5000/api/blogs');
          setBlogs(blogsRes.data);
          break;
        case 'gyms':
          const gymsRes = await axios.get('http://localhost:5000/api/gyms');
          setGyms(gymsRes.data);
          break;
        case 'tutorials':
          const tutorialsRes = await axios.get('http://localhost:5000/api/tutorials');
          setTutorials(tutorialsRes.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(getEmptyFormData(activeTab));
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`http://localhost:5000/api/${activeTab}/${id}`, config);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/${activeTab}/${editingItem._id}`, formData, config);
      } else {
        await axios.post(`http://localhost:5000/api/${activeTab}`, formData, config);
      }
      
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item');
    }
  };

  const getEmptyFormData = (tab) => {
    switch (tab) {
      case 'exercises':
        return {
          name: '',
          category: 'Strength',
          caloriesPerMinute: 0,
          difficulty: 'Beginner',
          description: '',
          instructions: ['']
        };
      case 'blogs':
        return {
          title: '',
          content: '',
          excerpt: '',
          category: 'Nutrition',
          author: '',
          tags: [''],
          readTime: 5,
          featured: false
        };
      case 'gyms':
        return {
          name: '',
          address: '',
          city: '',
          phone: '',
          rating: 0,
          priceRange: '$$',
          amenities: [''],
          featured: false
        };
      case 'tutorials':
        return {
          title: '',
          description: '',
          category: 'Strength',
          difficulty: 'Beginner',
          duration: 0,
          equipment: [''],
          steps: [{ step: 1, instruction: '', duration: 0 }],
          featured: false
        };
      default:
        return {};
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
          <p>Please log in with an admin account.</p>
        </div>
      </div>
    );
  }

  const renderTable = () => {
    const data = {
      exercises,
      blogs,
      gyms,
      tutorials
    }[activeTab];

    if (!data || data.length === 0) {
      return (
        <div className="no-data">
          <p>No {activeTab} found</p>
          <button className="add-btn" onClick={handleAdd}>
            Add First {activeTab.slice(0, -1)}
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Desktop Table View */}
        <div className="data-table desktop-only">
          <table>
            <thead>
              <tr>
                {getTableHeaders(activeTab).map(header => (
                  <th key={header}>{header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id}>
                  {getTableData(item, activeTab).map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-cards mobile-only">
          {data.map(item => (
            <div key={item._id} className="mobile-card">
              <div className="mobile-card-content">
                {renderMobileCardContent(item, activeTab)}
              </div>
              <div className="mobile-card-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const getTableHeaders = (tab) => {
    switch (tab) {
      case 'exercises':
        return ['Name', 'Category', 'Calories/Min', 'Difficulty'];
      case 'blogs':
        return ['Title', 'Category', 'Author', 'Featured', 'Likes'];
      case 'gyms':
        return ['Name', 'City', 'Rating', 'Price Range', 'Featured'];
      case 'tutorials':
        return ['Title', 'Category', 'Difficulty', 'Duration', 'Views'];
      default:
        return [];
    }
  };

  const getTableData = (item, tab) => {
    switch (tab) {
      case 'exercises':
        return [
          item.name,
          item.category,
          item.caloriesPerMinute,
          item.difficulty
        ];
      case 'blogs':
        return [
          item.title,
          item.category,
          item.author,
          item.featured ? 'Yes' : 'No',
          item.likes
        ];
      case 'gyms':
        return [
          item.name,
          item.city,
          item.rating,
          item.priceRange,
          item.featured ? 'Yes' : 'No'
        ];
      case 'tutorials':
        return [
          item.title,
          item.category,
          item.difficulty,
          `${item.duration} min`,
          item.views
        ];
      default:
        return [];
    }
  };

  const renderMobileCardContent = (item, tab) => {
    switch (tab) {
      case 'exercises':
        return (
          <>
            <h4>{item.name}</h4>
            <div className="card-details">
              <span><strong>Category:</strong> {item.category}</span>
              <span><strong>Calories/Min:</strong> {item.caloriesPerMinute}</span>
              <span><strong>Difficulty:</strong> {item.difficulty}</span>
            </div>
          </>
        );
      case 'blogs':
        return (
          <>
            <h4>{item.title}</h4>
            <div className="card-details">
              <span><strong>Category:</strong> {item.category}</span>
              <span><strong>Author:</strong> {item.author}</span>
              <span><strong>Featured:</strong> {item.featured ? 'Yes' : 'No'}</span>
              <span><strong>Likes:</strong> {item.likes}</span>
            </div>
          </>
        );
      case 'gyms':
        return (
          <>
            <h4>{item.name}</h4>
            <div className="card-details">
              <span><strong>City:</strong> {item.city}</span>
              <span><strong>Rating:</strong> {item.rating}</span>
              <span><strong>Price:</strong> {item.priceRange}</span>
              <span><strong>Featured:</strong> {item.featured ? 'Yes' : 'No'}</span>
            </div>
          </>
        );
      case 'tutorials':
        return (
          <>
            <h4>{item.title}</h4>
            <div className="card-details">
              <span><strong>Category:</strong> {item.category}</span>
              <span><strong>Difficulty:</strong> {item.difficulty}</span>
              <span><strong>Duration:</strong> {item.duration} min</span>
              <span><strong>Views:</strong> {item.views}</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your fitness tracker content</p>
      </div>

      <div className="admin-tabs">
        {['exercises', 'blogs', 'gyms', 'tutorials'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <div className="content-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
          <button className="add-btn" onClick={handleAdd}>
            Add New {activeTab.slice(0, -1)}
          </button>
        </div>

        {renderTable()}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              {renderFormFields(activeTab, formData, setFormData)}
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const renderFormFields = (tab, formData, setFormData) => {
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  switch (tab) {
    case 'exercises':
      return (
        <div className="form-fields">
          <input
            type="text"
            placeholder="Exercise Name"
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
          <select
            value={formData.category || 'Strength'}
            onChange={(e) => updateField('category', e.target.value)}
          >
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="Flexibility">Flexibility</option>
          </select>
          <input
            type="number"
            placeholder="Calories per Minute"
            value={formData.caloriesPerMinute || ''}
            onChange={(e) => updateField('caloriesPerMinute', parseInt(e.target.value))}
            required
          />
          <select
            value={formData.difficulty || 'Beginner'}
            onChange={(e) => updateField('difficulty', e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <textarea
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            required
          />
        </div>
      );
    
    case 'blogs':
      return (
        <div className="form-fields">
          <input
            type="text"
            placeholder="Blog Title"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
          <textarea
            placeholder="Excerpt"
            value={formData.excerpt || ''}
            onChange={(e) => updateField('excerpt', e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={formData.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            required
            rows={6}
          />
          <select
            value={formData.category || 'Nutrition'}
            onChange={(e) => updateField('category', e.target.value)}
          >
            <option value="Nutrition">Nutrition</option>
            <option value="Training">Training</option>
            <option value="Wellness">Wellness</option>
            <option value="Equipment">Equipment</option>
          </select>
          <input
            type="text"
            placeholder="Author"
            value={formData.author || ''}
            onChange={(e) => updateField('author', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Read Time (minutes)"
            value={formData.readTime || ''}
            onChange={(e) => updateField('readTime', parseInt(e.target.value))}
          />
          <label>
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Featured Blog
          </label>
        </div>
      );
    
    default:
      return <div>Form fields for {tab} coming soon...</div>;
  }
};

export default AdminPanel;
