import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useLanguage } from './LanguageContext';
import { useDataContext } from './DataContext';

const CalendarLeaderboard = () => {
  const { id } = useParams();
  const { baseUrl } = useDataContext();
  const { loading, data } = useFetch(`${baseUrl}/api/tournaments/${id}?populate=*`);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    if (!loading && data) {
      setLeaderboardData(data?.data?.leaderboard || []);
    }
  }, [data, loading]);

  const sortedLeaderboard = leaderboardData.sort((a, b) => b.score - a.score);

  const translations = [
    [
      { key: 'leaderboard', value: 'Leaderboard' },
      { key: 'rank', value: 'Rank' },
      { key: 'player', value: 'Backgammon Master' },
      { key: 'score', value: 'Score' },
      { key: 'noEntries', value: 'No entries in the leaderboard.' }
    ],
    [
      { key: 'leaderboard', value: 'ლიდერბორდი' },
      { key: 'rank', value: 'ადგილი' },
      { key: 'player', value: 'ნარდის ოსტატი' },
      { key: 'score', value: 'ქულა' },
      { key: 'noEntries', value: 'ლიდერბორდში არ არის ჩანაწერები.' }
    ]
  ];

  const getTranslation = (key) => {
    const translationsForLanguage = language === 'en' ? translations[0] : translations[1];
    const translation = translationsForLanguage.find(t => t.key === key);
    return translation ? translation.value : key;
  };

  const getTournamentName = () => {
    return language === 'en' ? data?.data?.englishName : data?.data?.name;
  };

  const getPlayerName = (entry) => {
    return language === 'en' ? entry.englishName : entry.name;
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-[108px]">
      <h1 className="text-1xl font-bold mb-4">{getTournamentName() || getTranslation('leaderboard')}</h1>

      {sortedLeaderboard.length > 0 ? (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-300 text-center bg-gray-100 font-semibold">{getTranslation('rank')}</th>
                <th className="py-2 px-4 border border-gray-300 text-center bg-gray-100 font-semibold">{getTranslation('player')}</th>
                <th className="py-2 px-4 border border-gray-300 text-center bg-gray-100 font-semibold">{getTranslation('score')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard.map((entry, index) => (
                <tr key={entry.id} className="border-b border-gray-200">
                  <td className="py-2 px-4 border border-gray-300 text-center">{index + 1}</td>
                  <td className="py-2 px-4 border border-gray-300 text-center">{getPlayerName(entry)}</td>
                  <td className="py-2 px-4 border border-gray-300 text-center">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>{getTranslation('noEntries')}</div>
      )}
    </div>
  );
};

export default CalendarLeaderboard;
