// app/input/page.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Input() {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [responses, setResponses] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (value) {
      const timer = setTimeout(() => {
        submit(value);
      }, 10); // Adjust the delay as needed (300ms pause to detect end of input)
      setDebounceTimer(timer);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [value]);

  const submit = (val) => {
    const token = Cookies.get('token');
    if (!token || !val) return;

    axios.post('https://zonecheck.up.railway.app/api/visits', {
      uuid: val,
      token: token
    })
    .then(res => {
      setResponses(prev => [...prev, res.data]);
    })
    .catch(err => {
      console.error(err);
      setResponses(prev => [...prev, { error: err.message }]);
    })
    .finally(() => {
      setValue('');  // Clear input after submit or error
      if (inputRef.current) {
        inputRef.current.focus();  // Refocus for next entry
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        ref={inputRef}
        className="w-full p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter UUID"
        autoFocus
      />
      <div className="mt-4">
        {responses.map((resp, index) => (
          <pre key={index} className="bg-gray-100 p-2 rounded mb-2 overflow-auto">
            {JSON.stringify(resp, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}