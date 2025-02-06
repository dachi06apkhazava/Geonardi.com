import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const International = () => {
    const { baseUrl } = useDataContext();
    const { language } = useLanguage();
    const [internationalHtml, setInternationalHtml] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInternationalData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/international?populate=*`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.data && data.data.content) {
                    if (language === 'en') {
                        setInternationalHtml(data.data.englishContent);
                    } else {
                        setInternationalHtml(data.data.content);
                    }
                } else {
                    setError('No international content found');
                }
            } catch (error) {
                setError('Error fetching international data');
            } finally {
                setLoading(false);
            }
        };

        fetchInternationalData();
    }, [baseUrl, language]);

    if (loading) return <div className="text-center"></div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container pt-32 mx-auto px-4 py-8 flex flex-col items-center justify-center">
            {internationalHtml ? (
                <div 
                    className="text-gray-800 mt-4 w-full mx-auto" 
                    dangerouslySetInnerHTML={{ __html: internationalHtml }}
                />
            ) : (
                <div className="pt-12 text-gray-500 text-sm sm:text-base">
                    {language === 'en' ? 'No international content available' : 'უნფორმაცია არ არის დადებული'}
                </div>
            )}
        </div>
    );
};

export default International;
