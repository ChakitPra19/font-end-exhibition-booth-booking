'use client';

import { useState, useEffect } from 'react';
import { getAllExhibitions } from '@/libs';
import { Exhibition } from '../../../interface';
import Link from 'next/link';

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await getAllExhibitions();
        if (response.success) {
          setExhibitions(response.data ?? []);
        } else {
          setExhibitions([]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch exhibitions');
        setExhibitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exhibitions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exhibitions</h1>
          <p className="mt-2 text-gray-600">Discover upcoming exhibitions and book your booth</p>
        </div>

        {exhibitions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exhibitions available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((exhibition) => (
              <div key={exhibition._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Exhibition Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={exhibition.posterPicture || '/img/cover.jpg'}
                    alt={exhibition.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* Exhibition Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exhibition.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {exhibition.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium">Venue:</span>
                      <span className="ml-2">{exhibition.venue}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-medium">Start Date:</span>
                      <span className="ml-2">{formatDate(exhibition.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{exhibition.durationDay} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex space-x-4">
                        <span className="text-green-600">
                          Small: {exhibition.smallBoothQuota} booths
                        </span>
                        <span className="text-blue-600">
                          Big: {exhibition.bigBoothQuota} booths
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/exhibitions/${exhibition._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Details
                    </Link>
                    
                    <Link
                      href={`/exhibitions/${exhibition._id}/book`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Book Booth
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
