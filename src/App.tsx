import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface CV {
  id: string;
  user_email: string;
  data: any;
  created_at: string;
  updated_at: string;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [email, setEmail] = useState('');
  const [cvData, setCvData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  async function fetchCVs() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from('cvs')
        .insert([
          {
            user_email: email,
            data: JSON.parse(cvData)
          }
        ]);

      if (error) throw error;

      // Clear form
      setEmail('');
      setCvData('');
      
      // Refresh CV list
      await fetchCVs();
      
    } catch (err: any) {
      console.error('Error submitting CV:', err);
      setError(err.message || 'An error occurred while submitting the CV');
    } finally {
      setIsSubmitting(false);
    }
  }

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
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

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="cvData" className="block text-sm font-medium text-gray-700">
                CV Data (JSON format)
              </label>
              <textarea
                id="cvData"
                value={cvData}
                onChange={(e) => setCvData(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit CV'}
            </button>
          </form>

          <div>
            <h2 className="text-xl font-bold mb-4">CVs in Database</h2>
            {cvs.length === 0 ? (
              <p>No CVs found in the database.</p>
            ) : (
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div key={cv.id} className="border p-4 rounded-lg">
                    <p className="font-semibold">Email: {cv.user_email}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(cv.created_at).toLocaleDateString()}
                    </p>
                    <pre className="mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(cv.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;