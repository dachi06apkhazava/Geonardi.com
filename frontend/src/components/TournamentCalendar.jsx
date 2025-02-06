import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

const TournamentCalendar = ({ calendars }) => {
  const [calendarData, setCalendarData] = useState([]);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    setCalendarData(calendars);
  }, [calendars]);

  const finishedItems = calendarData.filter(calendar => calendar.finished);
  const ongoingItems = calendarData.filter(calendar => !calendar.finished);

  ongoingItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  finishedItems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const translations = [
    [
      { key: 'calendar', value: 'Calendar' },
      { key: 'date', value: 'Date' },
      { key: 'tournament', value: 'Tournament' },
      { key: 'startTime', value: 'Start Time' },
      { key: 'noEvents', value: 'No events in the calendar.' }
    ],
    [
      { key: 'calendar', value: 'კალენდარი' },
      { key: 'date', value: 'თარიღი' },
      { key: 'tournament', value: 'ტურნირი' },
      { key: 'startTime', value: 'დაწყების დრო' },
      { key: 'noEvents', value: 'კალენდარში არ არის ღონისძიებები.' }
    ]
  ];

  const getTranslation = (key) => {
    const translationsForLanguage = language === 'en' ? translations[0] : translations[1];
    const translation = translationsForLanguage.find(t => t.key === key);
    return translation ? translation.value : key;
  };

  const getCalendarName = (calendar) => {
    return language === 'en' ? calendar.englishName : calendar.name;
  };

  const handleTournamentClick = (calendar) => {
    const tournamentId = calendar.id;
    const tournamentUrl = calendar.url;

    if (tournamentId) {
      navigate(`/results/${tournamentId}?url=${encodeURIComponent(tournamentUrl)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-[107px]">
      <h1 className="text-1xl font-bold mb-4">{getTranslation('calendar')}</h1>

      {calendarData.length > 0 ? (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-300 text-center">{getTranslation('date')}</th>
                <th className="py-2 px-4 border border-gray-300 text-center">{getTranslation('tournament')}</th>
                <th className="py-2 px-4 border border-gray-300 text-center">{getTranslation('startTime')}</th>
              </tr>
            </thead>
            <tbody>
              {ongoingItems.map(calendar => (
                <tr key={calendar.id} className="border-b border-gray-200 cursor-pointer" onClick={() => handleTournamentClick(calendar)}>
                  <td className="py-2 px-4 border border-gray-300 text-center">{new Date(calendar.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border border-gray-300 text-center">
                    <h3 className="text-blue-500 hover:underline">{getCalendarName(calendar) || 'Unnamed Event'}</h3>
                  </td>
                  <td className="py-2 px-4 border border-gray-300 text-center">{new Date(`1970-01-01T${calendar.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
              {finishedItems.map(calendar => (
                <tr key={calendar.id} className="border-b border-gray-200 bg-gray-100 cursor-pointer" onClick={() => handleTournamentClick(calendar)}>
                  <td className="py-2 px-4 border border-gray-300 text-center">{new Date(calendar.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border border-gray-300 text-center"><h3 className="text-gray-500">{getCalendarName(calendar) || 'Unnamed Event'} ✔️</h3></td>
                  <td className="py-2 px-4 border border-gray-300 text-center">{new Date(`1970-01-01T${calendar.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>{getTranslation('noEvents')}</div>
      )}
    </div>
  );
};

export default TournamentCalendar;
