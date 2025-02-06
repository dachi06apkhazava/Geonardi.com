import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

export default function Points() {
  const { baseUrl } = useDataContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/point?locale=${language}`);
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
          {block.children.map((child, index) => {
            const textStyle = child.bold ? 'font-bold' : child.underline ? 'underline' : '';
            return (
              <span key={index} className={textStyle}>
                {child.text}
              </span>
            );
          })}
        </p>
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

  if (loading) return <p className="text-center"></p>;
  if (error) return <p className="text-center text-red-500">Error fetching data!</p>;

  return (
    <div className="container mx-auto p-10 pt-32">
      <div className="mt-4">
        {data.text.map((block, index) => (
          <div key={index}>
            {renderTextBlock(block)}
            <div className="h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
