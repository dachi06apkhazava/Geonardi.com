import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useLanguage } from '../components/LanguageContext';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useDataContext } from '../components/DataContext';


const Newsdetails = () => {
  const { baseUrl } = useDataContext();
  const { id } = useParams();
  const { language } = useLanguage();

  const { loading, error, data } = useFetch(
    `${baseUrl}/api/newsblocks/${id}?populate=*`
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching news details!</p>;

  const newsItem = data?.data;

  if (!newsItem) return <p>No news item found!</p>;

  const title = language === 'en' ? newsItem.englishName : newsItem.title;
  const body = language === 'en' ? newsItem.englishBody : newsItem.body;

  const fallbackText = language === 'en' ? 'Details are not yet added' : 'დეტალები ჯერ არ დამატებულა';

  const imageUrl = newsItem?.content?.url ? `${baseUrl}${newsItem.content.url}` : '/placeholder.svg';

  return (
    <div className="container mx-auto p-10 pt-32">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[60vh] object-cover object-top"
        />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <span className="text-xs font-semibold text-gray-600">{newsItem.date}</span>
          <div className="mt-4 whitespace-pre-wrap">
            {body ? (
              <BlocksRenderer content={body} />
            ) : (
              <p>{fallbackText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsdetails;
