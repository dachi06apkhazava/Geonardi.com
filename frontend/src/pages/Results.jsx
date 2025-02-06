import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const Results = () => {
    const { baseUrl } = useDataContext();
    const { id } = useParams();
    const { language } = useLanguage();
    const [resultsHtml, setResultsHtml] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tournamentUrl, setTournamentUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournamentData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/tournaments?populate=TournamentCalendar`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const calendarEvent = data.data.flatMap(tournament => tournament.TournamentCalendar).find(event => event.id === parseInt(id));

                if (calendarEvent) {
                    setResultsHtml(calendarEvent.results);
                    setTournamentUrl(calendarEvent.url);
                } else {
                    console.error('No calendar event found with the provided ID');
                }
            } catch (error) {
                console.error('Error fetching tournament data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTournamentData();
    }, [id]);

    useEffect(() => {
        if (resultsHtml) {
            const figure = document.querySelector('.result-table figure.table');
            if (figure) {
                figure.classList.add('w-full');
            }
        }
    }, [resultsHtml]);

    useEffect(() => {
        if (resultsHtml) {
            const figure = document.querySelector('.result-table table');
            if (figure) {
                figure.classList.add('w-full');
            }
        }
    }, [resultsHtml]);

    if (loading) return <div className="text-center">{language === 'en' ? 'Loading...' : 'მიმდინარეობს ლოდინი...'}</div>;

    const handleRedirect = () => {
        if (tournamentUrl) {
            window.location.href = tournamentUrl;
        }
    };

    return (
        <div className="container pt-24 mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
            {resultsHtml ? (
                <>
                    <div 
                        className="result-table text-gray-800 mt-4 w-full mx-auto" 
                        dangerouslySetInnerHTML={{ __html: resultsHtml }} 
                    />
                    <style>
                        {`
                            .table {
                                width: 100% !important;
                            }

                            .text-gray-800 th, .text-gray-800 td {
                                padding: 8px 12px;
                                border: 1px solid #ddd;
                                text-align: left;
                                font-size: 11px !important;
                            }
                            .text-gray-800 tr:nth-child(even) {
                                background-color: #f2f2f2;
                            }
                            .text-gray-800 th {
                                background-color: #4CAF50;
                                color: black;
                                font-size: 9px !important;
                            }

                            @media (min-width: 640px) {
                                .text-gray-800 th, .text-gray-800 td {
                                    font-size: 16px !important;
                                }
                            }

                            @media (min-width: 1024px) {
                                .text-gray-800 th, .text-gray-800 td {
                                    font-size: 18px !important;
                                }
                            }

                            @media (min-width: 1280px) {
                                .text-gray-800 th, .text-gray-800 td {
                                    font-size: 20px !important;
                                }
                            }
                        `}
                    </style>

                    {tournamentUrl && (
                        <button 
                            onClick={handleRedirect}
                            className="bg-[#195c72] w-full text-white font-semibold py-2 px-4 rounded hover:bg-[#317e96] transition duration-200"
                        >
                            {language === 'en' ? 'Full Results' : 'სრული შედეგები'}
                        </button>
                    )}
                    <button onClick={() => navigate(-1)}  className="bg-[#195c72] mt-3 w-full text-white font-semibold py-2 px-4 rounded hover:bg-[#317e96] transition duration-200">
                        {language === 'en' ? 'Back' : 'უკან'}
                    </button>
                </>
            ) : (
                <div className="pt-12 text-gray-500 text-sm sm:text-base">
                    {language === 'en' ? 'Results are not yet available' : 'შედეგები ჯერ არ დადებულა'}
                </div>
            )}
        </div>
    );
};

export default Results;
