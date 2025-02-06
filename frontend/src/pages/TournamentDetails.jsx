import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useDataContext } from '../components/DataContext';

const TournamentDetail = () => {
  const { baseUrl } = useDataContext();
  const { id } = useParams();
  const { loading, error, data } = useFetch(`${baseUrl}/api/calendars/${id}?populate=*`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const tournament = data?.data;

  const imageUrl = tournament?.content?.url;

  return (
    <div className="container mx-auto p-16 pt-32">
      <h1 className="text-2xl font-bold mb-4">{tournament?.name}</h1>
      <p><strong>თარიღი:</strong> {tournament?.date}</p>
      <p><strong>რეგისტრაცია:</strong> {tournament?.registration}</p>
      <p><strong>დაწყება:</strong> {tournament?.start}</p>
      {imageUrl && (
        <img 
          src={`${baseUrl}${imageUrl}`} 
          alt={tournament.content.alternativeText || "Tournament Image"} 
          className="w-full h-auto mb-4 pt-10"
        />
      )}
      <div className="mt-4 whitespace-pre-wrap text-base md:text-lg">
          <BlocksRenderer content={tournament?.body} />
      </div>
    </div>
  );
};

export default TournamentDetail;
