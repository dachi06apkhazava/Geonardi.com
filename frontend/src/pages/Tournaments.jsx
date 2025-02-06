import React from 'react';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const Tournaments = () => {
  const { baseUrl } = useDataContext();
  const { language } = useLanguage();
  const { loading, error, data } = useFetch(`${baseUrl}/api/tournaments?filters[Archived][$eq]=false&populate=*`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading tournaments</div>;

  const tournaments = data?.data ?? [];

  return (
    <div className="pt-40 w-[80vw] container mx-auto px-4 pb-32 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Tournaments' : 'ტურნირები'}
      </h1>
      <div className="flex flex-wrap">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
            <Link to={`/tournaments/${tournament.documentId}`}>
            <div className="bg-cyan-800 transition-all duration-300 hover:bg-cyan-700 text-white h-72 flex flex-col justify-center items-center shadow-md rounded-lg overflow-hidden text-center">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                    {language === 'en' ? tournament.englishName : tournament.name}
                </h2>
                <p className="text-gray-600">
                  {tournament.description}
                </p>
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
