import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import useFetch from "../hooks/useFetch";
import { useDataContext } from '../components/DataContext';

const Federation = () => {
  const { baseUrl } = useDataContext();
  const { language } = useLanguage();
  const { loading, error, data } = useFetch(`${baseUrl}/api/federations?populate=*`);
  
  const federationData = data?.data ?? [];

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching data: {error}</div>;

  const sortedFederations = federationData.sort((a, b) => a.order - b.order);

  return (
    <div className="w-[90vw] max-w-6xl mx-auto px-4 pt-32 pb-12 text-center">
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Federations' : 'ფედერაციები'}
      </h1>

      <div className="flex flex-wrap justify-center">
        {Array.isArray(sortedFederations) && sortedFederations.map(fed => {
          const federationTitle = language === 'en' ? fed.englishName : fed.title;
          const imageUrl = fed.content?.url ? `${baseUrl}${fed.content.url}` : null;

          return (
            <div key={fed.id} className="w-full sm:w-1/3 p-4">
              <Link to={`/federation/${fed.documentId}`} className="text-gray-800 hover:text-blue-600 transition-colors duration-300">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:scale-105">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={federationTitle}
                  className="w-full h-64 object-cover object-center"
                  loading="lazy"
                />
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-2">
                      {federationTitle}
                  </h2>
                </div>
              </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 pb-12 text-gray-800 text-center">
          {language === 'en' ? 'Rules and Results' : 'წესები და შედეგები'}
        </h3>
        <div className="flex flex-wrap justify-center">
        <Link 
            to="/rules/champions" 
            className="bg-cyan-700 text-white w-52 h-16 flex items-center justify-center rounded hover:bg-cyan-600 transition-colors duration-300 mx-2 my-2"
          >
            {language === 'en' ? 'Contestant Results' : 'მონაწილეთა შედეგები'}
          </Link>
          <Link 
            to="/rules/international" 
            className="bg-cyan-700 text-xs text-white w-52 h-16 flex items-center justify-center rounded hover:bg-cyan-600 transition-colors duration-300 mx-2 my-2"
          >
            {language === 'en' ? 'International Results' : 'შედეგები საერთაშორისო ასპარეზი'}
          </Link>
          <Link 
            to="/rules/tournament-rules" 
            className="bg-cyan-700 text-white w-52 h-16 flex items-center justify-center rounded hover:bg-cyan-600 transition-colors duration-300 mx-2 my-2"
          >
            {language === 'en' ? 'International Results' : 'ტურნირების წესები'}
          </Link>
          <Link 
            to="/rules/scoring" 
            className="bg-cyan-700 text-white w-52 h-16 flex items-center justify-center rounded hover:bg-cyan-600 transition-colors duration-300 mx-2 my-2"
          >
            {language === 'en' ? 'Scoring System' : 'ქულების დარიცხვის სისტემა'}
          </Link>
          <Link 
            to="/rules/classical" 
            className="bg-cyan-700 text-white w-52 h-16 flex items-center justify-center rounded hover:bg-cyan-600 transition-colors duration-300 mx-2 my-2"
          >
            {language === 'en' ? 'Backgammon Rules' : 'ნარდის თამაშის წესები'}
          </Link>
          <Link 
            to="/rules/long" 
            className="bg-cyan-700 text-white w-52 h-16 flex items-center justify-center rounded hover:bg-cyan-600 transition-colors duration-300 mx-2 my-2"
          >
            {language === 'en' ? 'Long Backgammon Rules' : 'გრძელი ნარდის თამაშის წესები'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Federation;
