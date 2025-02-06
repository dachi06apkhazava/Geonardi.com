import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const Tournaments = () => {
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [groupedTournaments, setGroupedTournaments] = useState({});

  const apiUrl = `${baseUrl}/api/tournaments?filters[Archived][$eq]=true&populate=*`;
  const { loading, error, data } = useFetch(apiUrl);

  useEffect(() => {
    if (data && data.data) {
      const years = data.data.map(tournament => {
        return tournament.year || new Date(tournament.createdAt).getFullYear();
      });

      const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
      setAvailableYears(uniqueYears);

      const grouped = data.data.reduce((acc, tournament) => {
        const year = tournament.year || new Date(tournament.createdAt).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(tournament);
        return acc;
      }, {});

      setGroupedTournaments(grouped);
    }
  }, [data]);

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const handleBackClick = () => {
    setSelectedYear(null);
  };

  if (selectedYear === null) {
    return (
      <div className="pt-40 w-[80vw] container mx-auto px-4 pb-32 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'en' ? 'Archive' : 'არქივი'}
        </h1>

        <div className="flex flex-wrap mb-8">
          {availableYears.map((year) => (
            <div
              key={year}
              className="w-full sm:w-1/2 lg:w-1/5 p-2 cursor-pointer"
              onClick={() => handleYearClick(year)}
            >
              <div className="bg-cyan-800 transition-all duration-300 hover:bg-cyan-700 text-white h-20 flex justify-center items-center shadow-md rounded-lg overflow-hidden text-center">
                <span className="text-xl font-semibold">{year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading tournaments for {selectedYear}...</div>;
  if (error) {
    console.log("Error loading tournaments:", error);
    return <div>Error loading tournaments for {selectedYear}</div>;
  }

  const tournaments = groupedTournaments[selectedYear] || [];

  return (
    <div className="pt-40 w-[80vw] container mx-auto px-4 pb-32 py-8">
      <div className='w-full flex flex-col sm:flex-row'>
        <h1 className="basis-5/6 text-2xl text-left font-bold mb-6">
            {language === 'en' ? 'Tournaments Archive' : 'ტურნირების არქივი'}
        </h1>
        <button onClick={handleBackClick} className="text-center basis-1/6 mb-4 bg-cyan-800 text-white rounded-lg hover:underline">
          {language === 'en' ? 'Back' : 'უკან'}
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div>No tournaments found for {selectedYear}</div>
      ) : (
        <div className="flex flex-wrap">
          {tournaments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((tournament) => (
            <div key={tournament.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <Link to={`/tournaments/${tournament.documentId}`}>
              <div className="bg-cyan-800 transition-all duration-300 hover:bg-cyan-700 text-white h-72 flex flex-col justify-center items-center shadow-md rounded-lg overflow-hidden text-center">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">                    
                      {language === 'en' ? tournament.englishName : tournament.name}
                  </h2>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournaments;
