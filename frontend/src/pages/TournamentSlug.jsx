import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import TournamentCalendar from '../components/TournamentCalendar.jsx';
import CalendarLeaderboard from '../components/CalendarLeaderboard.jsx';
import { useLanguage } from '../components/LanguageContext.jsx';
import { useDataContext } from '../components/DataContext';

const TournamentSlug = () => {
  const { baseUrl } = useDataContext();
  const { language } = useLanguage();
  const { id } = useParams();
  const { loading, error, data } = useFetch(`${baseUrl}/api/tournaments/${id}?populate=*`);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error || !data || !data.data) return <div>Error loading tournament details</div>;

  const tournamentData = data.data;

  const handleTournamentClick = (calendar) => {
    const tournamentId = calendar.id;
    const tournamentUrl = calendar.url;

    if (tournamentId && tournamentUrl) {
      navigate(`/results/${tournamentId}?url=${encodeURIComponent(tournamentUrl)}`);
    } else {
      console.error('No valid tournament ID or URL found for calendar:', calendar);
    }
  };

  return (
    <div className="w-[99vw] container mx-auto px-8 pt-16 pb-16">
      {tournamentData.TournamentCalendar && tournamentData.TournamentCalendar.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TournamentCalendar 
              calendars={tournamentData.TournamentCalendar} 
              onTournamentClick={handleTournamentClick} 
            />
          </div>
          <div className="flex-1">
            <CalendarLeaderboard leaderboardData={tournamentData.leaderboard} />
          </div>
        </div>
      ) : (
        <div>No calendars available for this tournament.</div>
      )}
      <div className="text-center mt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 w-full bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition duration-300"
        >
          {language == 'en' ? 'back' : 'უკან'}
        </button>
      </div>
    </div>
  );
};

export default TournamentSlug;
