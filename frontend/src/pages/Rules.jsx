import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

export default function Rules() {
  const { baseUrl } = useDataContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/rule?locale=${language}&populate=*`);
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
        <p className="whitespace-pre-wrap">
          {block.children.map((child, index) => (
            <span key={index}>
              {child.text}
            </span>
          ))}
        </p>
      );
    }
    if (block.type === 'heading') {
      const HeadingTag = `h${block.level}`;
      return (
        <HeadingTag className="font-bold underline text-4xl">
          {block.children.map((child, index) => (
            <span key={index}>
              {child.text}
            </span>
          ))}
        </HeadingTag>
      );
    }
    if (block.type === 'list') {
      return (
        <ul className="list-disc list-inside pl-5">
          {block.children.map((item, index) => (
            <li key={index} className="whitespace-pre-wrap">
              {item.children.map((child, childIndex) => (
                <span key={childIndex}>
                  {child.text}
                </span>
              ))}
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
        {data.text.map((block, index) => (
          <div key={index}>
            {renderTextBlock(block)}
            <div className="h-4" />
          </div>
        ))}
      </div>
      {data.image && (
        <div className="mt-8">
          <img src={`${baseUrl}${data.image.url}`} alt="Rules" className="mx-auto" />
        </div>
      )}
    </div>
  );
}
