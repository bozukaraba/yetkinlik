import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvs, setCvs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.from('cvs').select('*');
        
        if (error) throw error;
        
        setIsConnected(true);
        setCvs(data || []);
      } catch (err: any) {
        console.error('Database error:', err);
        setIsConnected(false);
        setError(err.message || 'An error occurred while connecting to the database');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Yetkinlik Project</h1>
        
        <div className="mb-4">
          <p className="text-lg">
            Database Connection Status:{' '}
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </p>
          
          {error && (
            <p className="text-red-600 mt-2">
              Error: {error}
            </p>
          )}
        </div>

        {isConnected && (
          <div>
            <h2 className="text-xl font-bold mb-2">CVs in Database</h2>
            {cvs.length === 0 ? (
              <p>No CVs found in the database.</p>
            ) : (
              <ul className="list-disc pl-5">
                {cvs.map((cv) => (
                  <li key={cv.id}>
                    CV for: {cv.user_email}
                    <br />
                    Created: {new Date(cv.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;