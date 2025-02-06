import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useDataContext } from './DataContext';

const Leaderboard = () => {
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();
  const [entries, setEntries] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [leaderboardName, setLeaderboardName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/tournaments?filters[Archived][$eq]=false&populate[leaderboard]=true`);
        const data = await response.json();

        const filteredTournaments = data.data.filter(tournament => {
          const leaderboard = tournament.leaderboard;
          return leaderboard && leaderboard.length > 1;
        });

        setTournaments(filteredTournaments);

        if (filteredTournaments.length > 0) {
          const recentTournament = filteredTournaments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
          setSelectedTournament(recentTournament.documentId);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournaments();
  }, [baseUrl]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!selectedTournament) return;

      setLoading(true);
      setEntries([]);
      setLeaderboardName('');

      try {
        const response = await fetch(`${baseUrl}/api/tournaments?populate=leaderboard`);
        const data = await response.json();
        const selectedTournamentData = data.data.find(tournament => tournament.documentId === selectedTournament);

        if (selectedTournamentData) {
          const leaderboardEntries = selectedTournamentData.leaderboard.slice(0, 10);
          const sortedEntries = leaderboardEntries.sort((a, b) => b.score - a.score).map((entry, index) => ({
            ...entry,
            rank: index + 1,
          }));

          setEntries(sortedEntries);

          const tournamentName = language === 'en' ? selectedTournamentData.englishName : selectedTournamentData.name;
          setLeaderboardName(tournamentName || 'Leaderboard');
        } else {
          throw new Error('No leaderboard data found for the selected tournament.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [selectedTournament, language, baseUrl]);

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">{language === 'en' ? 'Top 10' : 'ტოპ 10'}</h1>

      <div className="mb-4">
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.documentId}>
              {language === 'en' ? tournament.englishName : tournament.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white text-center">
          <thead>
            <tr className="bg-[#195c72] text-white">
              <th className="border border-gray-300 px-4 py-2">Rank</th>
              <th className="border border-gray-300 px-4 py-2">Contestant</th>
              <th className="border border-gray-300 px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="bg-[#42869b] text-white">
                <td className="border border-gray-300 px-4 py-2">{entry.rank}</td>
                <td className="border border-gray-300 px-4 py-2">{language === 'en' ? entry.englishName : entry.name}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
