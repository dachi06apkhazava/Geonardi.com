import React, { useEffect, useState } from 'react';
import Leaderboard from './Leaderboard';
import Newsblock from './Newsblock';
import { useLanguage } from './LanguageContext';
import { useDataContext } from './DataContext';

const Dashboard = () => {
  const [partners, setPartners] = useState([]);
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/partners?populate=*&sort[0]=order:asc`);
        const data = await response.json();
        setPartners(data?.data ?? []);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, [baseUrl]);

  const first4Partners = partners.slice(0, 4);

  const translations = [
    [
      { key: 'partnersPageTitle', value: 'Our Partners' },
    ],
    [
      { key: 'partnersPageTitle', value: 'ჩვენი პარტნიორები' },
    ]
  ];

  const getTranslation = (key) => {
    const translationsForLanguage = language === 'en' ? translations[0] : translations[1];
    const translation = translationsForLanguage.find(t => t.key === key);
    return translation ? translation.value : key;
  };

  const getPartnerName = (partner) => {
    return language === 'en' ? partner.englishName : partner.name;
  };

  return (
    <div className="flex flex-col xl:flex-row xl:space-x-8 p-4">
      <div className="w-full xl:w-2/5 order-1 xl:order-2 mb-6 xl:mb-0 flex flex-col">
        <Leaderboard />
        <div className="bg-white p-6">
          <h2 className="text-xl text-center pb-6 font-bold mb-4">{getTranslation('partnersPageTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {first4Partners.map(partner => {
              const { id, image, url } = partner;
              const imageUrl = image?.url ? `${baseUrl}${image.url}` : null;

              return (
                <div key={id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image.alternativeText || 'Partner Logo'}
                      className="w-full h-48 custom:h-28 object-contain mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200">No Logo</div>
                  )}
                  <div className="pb-6 pt-3 text-center">
                    <h3 className="font-semibold">
                      <a
                        href={url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {getPartnerName(partner) || 'Unnamed Partner'}
                      </a>
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-3/5 order-2 xl:order-1">
        <Newsblock />
      </div>
    </div>
  );
};

export default Dashboard;
