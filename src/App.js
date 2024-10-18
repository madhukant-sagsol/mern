import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserAPI.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState({ fname: '', lname: '', email: '', password: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getall');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/getone/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create', newUser);
      alert(response.data.msg);
      fetchAllUsers();
      setNewUser({ fname: '', lname: '', email: '', password: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/update/${userIdToUpdate}`, newUser);
      alert(response.data.msg);
      fetchAllUsers();
      setIsUpdating(false);
      setNewUser({ fname: '', lname: '', email: '', password: '' });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUpdateClick = (user) => {
    setIsUpdating(true);
    setUserIdToUpdate(user._id);
    setNewUser({ fname: user.fname, lname: user.lname, email: user.email, password: user.password });
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/delete/${id}`);
      alert(response.data.msg);
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-api-container">
      <h1>User Management</h1>
      <div className="create-user-form">
        <h2>{isUpdating ? 'Update User' : 'Create User'}</h2>
        <input
          type="text"
          placeholder="First Name"
          value={newUser.fname}
          onChange={(e) => setNewUser({ ...newUser, fname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lname}
          onChange={(e) => setNewUser({ ...newUser, lname: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button onClick={isUpdating ? updateUser : createUser}>
          {isUpdating ? 'Update User' : 'Create User'}
        </button>
      </div>

      <h2>All Users</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} className="user-list-item">
            {user.fname} {user.lname} ({user.email})
            <button onClick={() => fetchUserById(user._id)}>View</button>
            <button onClick={() => handleUpdateClick(user)}>Edit</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {user && (
        <div className="user-details">
          <h2>User Details</h2>
          <p>First Name: {user.fname}</p>
          <p>Last Name: {user.lname}</p>
          <p>Email: {user.email}</p>
          <p>password: {user.password}</p>
        </div>
      )}
    </div>
  );
};

export default App;
