import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

export default function LongRules() {
  const { baseUrl } = useDataContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/long?populate=*&locale=${language}`);
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const renderTextBlock = (block) => {
    if (block.type === 'paragraph') {
      return (
        <p className="mb-4">
          {block.children.map((child, index) => {
            if (child.type === 'text') {
              return child.text;
            }
            return null;
          })}
        </p>
      );
    }

    if (block.type === 'list') {
      return (
        <ul className="list-disc list-inside pl-5 mb-4">
          {block.children.map((item, index) => (
            <li key={index} className="mb-2">
              {item.children.map((child, childIndex) => {
                if (child.type === 'text') {
                  return child.text;
                }
                return null;
              })}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data!</p>;

  return (
    <div className="container mx-auto p-10 pt-32">
      <div className="mt-4">
        {data?.text?.map((block, index) => (
          <div key={index}>
            {renderTextBlock(block)}
          </div>
        ))}
      </div>
      {data?.image && (
        <div className="mt-4">
          <img
            src={`${baseUrl}${data.image.url}`}
            alt={data.image.caption || 'Image'}
            className="max-w-xs mx-auto h-auto"
          />
        </div>
      )}
    </div>
  );
}
