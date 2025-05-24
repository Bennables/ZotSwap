'use client';
import { useEffect, useState } from 'react';

export default function SwipePage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users'); // Next.js API
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center mt-6">
      {users.map((user, i) => (
        <div key={i} className="p-4 m-2 bg-white rounded shadow w-4/5">
          <img src={user.image} className="w-full h-48 object-cover rounded" />
          <h2 className="text-xl font-bold mt-2">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.bio}</p>
          <p className="text-xs text-gray-400">{user.skills.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
