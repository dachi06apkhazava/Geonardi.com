import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';
import useFetch from "../hooks/useFetch";

const Calendar = () => {
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();
  const { loading, error, data } = useFetch(
    `${baseUrl}/api/tournaments?filters[Archived][$eq]=false&populate=*`
  );
  const [selectedTournament, setSelectedTournament] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      console.log('Fetched Tournament Data:', data);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching tournaments: {error.message}</div>;

  const tournaments = data?.data ?? [];
  const calendarItems = tournaments.flatMap(tournament => {
    return tournament.TournamentCalendar ? tournament.TournamentCalendar.map(item => ({
      ...item,
      tournamentId: tournament.documentId,
      calendarName: language === 'en' ? item.englishName : item.name,
      tournamentUrl: item.url,
    })) : [];
  });

  const sortedItems = calendarItems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredItems = sortedItems.filter(item => {
    const matchesTournament = selectedTournament ? item.tournamentId === selectedTournament : true;
    const matchesSearch = item.calendarName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'finished' ? item.finished : !item.finished);
    return matchesTournament && matchesSearch && matchesStatus;
  });

  const ongoingItems = filteredItems.filter(item => !item.finished);
  const finishedItems = filteredItems.filter(item => item.finished);

  const handleTournamentClick = (item) => {
    const tournamentId = item.id;
    const tournamentUrl = item.tournamentUrl;

    if (tournamentId) {
      navigate(`/results/${tournamentId}?url=${encodeURIComponent(tournamentUrl)}`);
    } else {
      console.error('No valid tournament ID found for item:', item);
    }
  };

  return (
    <div className="container mx-auto p-16 pt-40">
      <h1 className="text-2xl font-bold mb-6">{language === 'en' ? 'Tournaments Calendar' : 'ტურნირების კალენდარი'}</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
        <select
          id="tournamentSelect"
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-4"
        >
          <option value="">{language === 'en' ? 'All Tournaments' : 'ყველა ტურნირი'}</option>
          {tournaments.map(tournament => (
            <option key={tournament.id} value={tournament.documentId}>
              {language === 'en' ? tournament.englishName : tournament.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={language === 'en' ? 'Tournament Name' : 'ტურნირის სახელი'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-4"
        />

        <select
          id="statusSelect"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{language === 'en' ? 'All' : 'ყველა'}</option>
          <option value="finished">{language === 'en' ? 'Finished' : 'დასრულებული'}</option>
          <option value="ongoing">{language === 'en' ? 'Ongoing' : 'აქტიური'}</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">{language === 'en' ? 'Date' : 'თარიღი'}</th>
              <th className="py-3 px-6 text-left">{language === 'en' ? 'Calendar Name' : 'კალენდარის სახელი'}</th>
              <th className="py-3 px-6 text-left">{language === 'en' ? 'Start Time' : 'დაწყების დრო'}</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {statusFilter === 'ongoing' && ongoingItems.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-3">{language === 'en' ? 'No ongoing tournaments found.' : 'გრძელდება ტურნირები არ არის'}</td>
              </tr>
            )}
            {ongoingItems.map(item => (
              <tr 
                key={item.id} 
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer" 
                onClick={() => handleTournamentClick(item)}
              >
                <td className="py-3 px-6 text-left">
                  {item.date ? new Date(item.date).toLocaleDateString() : 'No Date'}
                </td>
                <td className="py-3 px-6 text-left">
                  <h3 className="text-blue-500 hover:underline">{item.calendarName || 'No Calendar Name'}</h3>
                </td>
                <td className="py-3 px-6 text-left">
                  {item.start ? new Date(`1970-01-01T${item.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Start Time'}
                </td>
              </tr>
            ))}
            {finishedItems.length > 0 && finishedItems.map(item => (
              <tr 
                key={item.id} 
                className="border-b border-gray-200 bg-gray-100 hover:bg-gray-200 cursor-pointer" 
                onClick={() => handleTournamentClick(item)}
              >
                <td className="py-3 px-6 text-left">
                  {item.date ? new Date(item.date).toLocaleDateString() : 'No Date'}
                </td>
                <td className="py-3 px-6 text-left">
                  <h3 className="text-gray-500">{item.calendarName || 'No Calendar Name'} ✔️</h3>
                </td>
                <td className="py-3 px-6 text-left">
                  {item.start ? new Date(`1970-01-01T${item.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Start Time'}
                </td>
              </tr>
            ))}
            {statusFilter === 'finished' && finishedItems.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-3">{language === 'en' ? 'No finished tournaments found.' : 'დასრულებული ტურნირები არ არის'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
