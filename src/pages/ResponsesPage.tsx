import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface Response {
  id: number;
  name: string;
  email: string;
  message: string;
}

const ResponsesPage = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('responses').select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setResponses(data);
        }
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-background flex justify-center items-center">
        <p className="text-2xl text-white">Loading responses...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Contact Responses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here are the messages we've received from our users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {responses.map((response) => (
            <div key={response.id} className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-2">{response.name}</h3>
              <p className="text-black/80 mb-4">{response.email}</p>
              <p className="text-black/60">{response.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;
