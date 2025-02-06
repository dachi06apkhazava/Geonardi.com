import useFetch from "../hooks/useFetch";
import React from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const PartnersPage = () => {
  const { baseUrl } = useDataContext();
  const { loading, error, data } = useFetch(`${baseUrl}/api/partners?populate=*&sort[0]=order:asc`);
  const { language } = useLanguage();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const partners = data?.data ?? [];

  if (partners.length === 0) return <div>No partners found.</div>;

  const translations = [
    [
      { key: 'partnersPageTitle', value: 'Our Partners' },
      { key: 'noPartners', value: 'No partners found.' },
    ],
    [
      { key: 'partnersPageTitle', value: 'ჩვენი პარტნიორები' },
      { key: 'noPartners', value: 'პარტნიორები ვერ მოიძებნა.' },
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
    <div className="w-[80vw] container mx-auto px-4 pb-32 pt-40 py-8">
      <h1 className="text-2xl text-center pb-12 font-bold mb-6">{getTranslation('partnersPageTitle')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map(partner => {
          const { id, image, url } = partner;

          const imageUrl = image?.url 
            ? `${baseUrl}${image.url}` 
            : null;

          return (
            <div 
              key={id} 
              className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={image.alternativeText || 'Partner Logo'} 
                  className="w-full h-48 object-contain mb-4"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200">No Logo</div>
              )}
              <div className="p-4 text-center">
                <h3 className="font-semibold mt-2 mb-2">
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
  );
}

export default PartnersPage;
