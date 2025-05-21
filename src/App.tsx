import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data } = await supabase.from('test').select('*').limit(1);
        setIsConnected(true);
      } catch (error) {
        console.error('Database connection error:', error);
        setIsConnected(false);
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Yetkinlik Project</h1>
        <p className="text-lg">
          Database Connection Status:{' '}
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App