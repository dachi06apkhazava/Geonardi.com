import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const FederationDetails = () => {
  const { baseUrl } = useDataContext();
  const { id } = useParams();
  const { language } = useLanguage();

  const { loading, error, data } = useFetch(`${baseUrl}/api/federations/${id}?populate=*`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching federation details!</p>;

  const federationItem = data?.data;
  const imageUrl = federationItem?.content?.url ? `${baseUrl}${federationItem.content.url}` : '/placeholder.svg';

  const bodyContent = language === 'en' ? federationItem?.englishBody : federationItem?.body;
  const TitleContent = language === 'en' ? federationItem?.englishName : federationItem?.title;

  const fallbackText = language === 'en' ? "Details are not yet added" : "დეტალები ჯერ არ დამატებულა";

  return (
    <div className="container mx-auto p-10 pt-32 items-center justify-center">
      {federationItem && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={federationItem.title}
            className="w-[30vw] h-74 object-cover mx-auto"
            loading="lazy"
          />
          <div className="p-4 flex flex-col items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-left">
              {TitleContent}
            </h1>
            <div className="mt-4 text-sm sm:text-sm md:text-lg lg:text-xl whitespace-pre-wrap">
              {bodyContent ? (
                <BlocksRenderer content={bodyContent} />
              ) : (
                <p>{fallbackText}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FederationDetails;
