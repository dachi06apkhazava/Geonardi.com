import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

export default function Champions() {
  const { baseUrl} = useDataContext();
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/Contestant-results?populate=results`);
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const allYears = new Set();
  data.forEach(entry => {
    entry.results.forEach(result => {
      allYears.add(result.year);
    });
  });

  const sortedYears = Array.from(allYears).sort((a, b) => b - a);

  return (
    <div className="lg:w-[80vw] pt-40 container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold pb-8 text-center">
        {language === 'en' ? 'Georgian Champions' : 'საქართველოს ჩემპიონები'}
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white text-center">
          <thead>
            <tr className="bg-[#195c72] text-white">
              <th className="border border-gray-300 px-4 py-2">{language === 'en' ? 'Year' : 'წელი'}</th>
              {data.map((entry) => (
                <th key={entry.id} className="border border-gray-300 px-4 py-2">
                  {language === 'en' ? entry.englishName : entry.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedYears.map((year) => (
              <tr key={year} className="bg-[#42869b] text-white">
                <td className="border border-gray-300 px-4 py-2">{year}</td>
                {data.map((entry) => {
                  const resultForYear = entry.results.find((result) => result.year === year);
                  return (
                    <td key={entry.id} className="border border-gray-300 px-4 py-2">
                      {resultForYear
                        ? language === 'en'
                          ? resultForYear.englishName || '-'
                          : resultForYear.name || '-'
                        : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
