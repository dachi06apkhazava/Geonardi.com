import useFetch from "../hooks/useFetch";
import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

Modal.setAppElement('#root');

const GalleryPage = () => {
  const { baseUrl } = useDataContext();
  const { language } = useLanguage();
  const { loading, error, data } = useFetch(`${baseUrl}/api/galleries?populate=*`);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({ url: '', alt: '', type: '' });

  if (loading) return <div>{language === 'en' ? 'Loading...' : 'მიმდინარე...'}</div>;
  if (error) return <div>{language === 'en' ? `Error: ${error.message}` : `შეცდომა: ${error.message}`}</div>;

  const galleryItems = data?.data ?? [];

  const handleMediaClick = (url, alt, type) => {
    setSelectedMedia({ url, alt, type });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-[96vw] pt-40 pb-32 container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {galleryItems.map(item => {
          const media = item.file;
          const mediaUrl = media?.url ? `${baseUrl}${media.url}` : null;

          return (
            <div key={media.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
              {mediaUrl ? ( (
                  <img 
                    src={mediaUrl} 
                    alt={media.alternativeText || media.name} 
                    className="w-full h-48 object-top object-cover cursor-pointer transition-transform duration-300 transform hover:scale-105" 
                    onClick={() => handleMediaClick(mediaUrl, media.name, 'image')} 
                    loading="lazy"
                  />
                )
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                  {language === 'en' ? 'No Media' : 'არ არის მედია'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={handleCloseModal} 
        className="fixed custom:pt-24 inset-0 flex items-center justify-center z-50" 
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300 ease-in-out"
      >
        <div className="relative">
          <button 
            onClick={handleCloseModal} 
            className="absolute top-4 right-4 bg-gray-600 text-white p-2 hover:bg-gray-700 transition-colors duration-300"
          >
            ✕
          </button>
          <img 
            src={selectedMedia.url} 
            alt={selectedMedia.alt} 
            className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-lg" 
          />
        </div>
      </Modal>
    </div>
  );
}

export default GalleryPage;
