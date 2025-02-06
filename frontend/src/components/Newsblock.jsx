import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useDataContext } from './DataContext';
import debounce from 'lodash.debounce';

const Newsblock = () => {
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/newsblocks?populate=*`);
        const data = await response.json();
        setNewsData(data.data || []);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchNews();
  }, [baseUrl]);

  const debouncedSearch = useMemo(() => debounce((query) => setSearchQuery(query), 500), []);

  const filteredNews = useMemo(() => {
    return (newsData || []).filter(news => {
      const title = language === 'en' ? news.englishName : news.title;
      const matchesQuery = title && title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = selectedDate ? formatDate(news.createdAt) === selectedDate : true;
      return matchesQuery && matchesDate;
    });
  }, [newsData, searchQuery, selectedDate, language]);

  const sortedNews = useMemo(() => {
    return filteredNews.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
  }, [filteredNews]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const translations = [
    [
      { key: 'newsTitle', value: 'Recent news' },
    ],
    [
      { key: 'newsTitle', value: 'სიახლეები' },
    ]
  ];

  const getTranslation = (key) => {
    const translationsForLanguage = language === 'en' ? translations[0] : translations[1];
    const translation = translationsForLanguage.find(t => t.key === key);
    return translation ? translation.value : key;
  };

  if (loading) return <div className="text-center"></div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl text-center font-bold pb-4">{getTranslation('newsTitle')}</h1>
      <div className="flex flex-col sm:flex-row mb-4">
        <div className="flex-1 mb-2 sm:mb-0 sm:mr-2">
          <input
            type="text"
            placeholder={language === 'en' ? '🔍 Search by title' : '🔍 მოძებნეთ სათაურით'}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
        </div>
      </div>

      <div className="flex flex-wrap -mx-4">
        {sortedNews.map(news => {
          const imageUrl = news.content?.url ? `${baseUrl}${news.content.url}` : "/placeholder.svg";
          const formattedDate = formatDate(news.createdAt);

          return (
            <div key={news.id} className="w-full sm:w-1/2 lg:w-1/2 p-4">
              <div className="bg-white shadow-md rounded-lg overflow-hidden w-full h-full max-h-[400px]">
                <img
                  src={imageUrl}
                  alt={news.title}
                  className="w-full h-52 object-cover object-top"
                  loading="lazy"
                />
                <div className="p-4">
                  <span className="text-xs font-semibold text-gray-500">{formattedDate}</span>
                  <h2 className="text-[0.7em] font-bold mt-2 mb-2 text-gray-800 hover:text-blue-600 transition-colors">
                    <Link 
                      to={`/news/${news.documentId}`} 
                      className="block w-full truncate" 
                      title={news.title}
                    >
                      {language === 'en' ? news.englishName : news.title}
                    </Link>
                  </h2>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Newsblock;
