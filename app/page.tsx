// app/page.tsx

'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Home() {
  type Zone = { id: string | number; name: string };
  const [zones, setZones] = useState<Zone[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get('https://zonecheck.up.railway.app/api/scanner/zones')
      .then((res) => setZones(res.data.zones))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (zone) => {
    const randomName = 'Whatever' + Math.floor(Math.random() * 1000);
    axios
      .post('https://zonecheck.up.railway.app/api/scanner/pair', {
        name: randomName,
        zone_id: zone.id.toString(), // Ensure zone_id is string as per example
      })
      .then((res) => {
        const token = res.data.scanner.token;
        Cookies.set('token', token);
        router.push('/input');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div
            key={zone?.id}
            className="p-4 bg-blue-200 rounded-lg shadow cursor-pointer hover:bg-blue-300 transition"
            onClick={() => handleClick(zone)}
          >
            {zone?.name}
          </div>
        ))}
      </div>
    </div>
  );
}
