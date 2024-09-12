import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Fetch users from the backend
        axios.get('http://localhost:5000/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/users', { name, email })
            .then(res => setUsers([...users, res.data]))
            .catch(err => console.error(err));
        setName('');
        setEmail('');
    };

    return (
        <div className="App">
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} ({user.email})</li>
                ))}
            </ul>
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}

export default App;
