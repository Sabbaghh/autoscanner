'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Input() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  type ApiResponse =
    | { uuid: string; token: string; [key: string]: unknown }
    | { error: string };
  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(value);
    }
  };

  const submit = (val: string) => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
      return;
    }
    if (!val) return;

    axios
      .post('https://zonecheck.up.railway.app/api/visits', {
        uuid: val,
        token: token,
      })
      .then((res) => {
        setResponses((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        console.error(err);
        setResponses((prev) => [...prev, { error: err.message }]);
      })
      .finally(() => {
        setValue(''); // Clear input after submit or error
        if (inputRef.current) {
          inputRef.current.focus(); // Refocus for next entry
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
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className="w-full p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter UUID"
        autoFocus
      />
      <div className="mt-4">
        {responses.map((resp, index) => (
          <pre
            key={index}
            className="bg-gray-100 p-2 rounded mb-2 overflow-auto"
          >
            {JSON.stringify(resp, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}
