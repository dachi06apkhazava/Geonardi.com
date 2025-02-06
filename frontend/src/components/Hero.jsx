import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useDataContext } from './DataContext';

const HeroBanner = ({ scrollToNews }) => {
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/heroes?populate=*`);
        const data = await response.json();
        const fetchedImages = data.data.map(hero => {
          return hero.image?.url ? `${baseUrl}${hero.image.url}` : null;
        }).filter(image => image !== null);

        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
        } else {
          setError('No images found');
        }

        setLoading(false);
      } catch (error) {
        setError('Error fetching images');
        setLoading(false);
      }
    };

    fetchImages();
  }, [baseUrl]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [images]);

  if (loading) return <div className="text-center"></div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const content = {
    en: {
      title: 'Georgian Sports Backgammon Federation',
      subtitle: 'საქართველოს სპორტული ნარდის ფედერაცია',
      buttonText: 'News',
    },
    ka: {
      title: 'საქართველოს სპორტული ნარდის ფედერაცია',
      subtitle: 'GEORGIAN SPORT BACKGAMMON FEDERATION',
      buttonText: 'სიახლეები',
    }
  };

  const currentContent = language === 'ka-GE' ? content.ka : content.en;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {images.length > 0 && images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">
          {currentContent.title}
        </h1>
        <p className="text-1xl md:text-2xl text-center mb-8 max-w-2xl px-4">
          {currentContent.subtitle}
        </p>
        <button
          onClick={scrollToNews}
          style={{ background: "#195C72" }}
          className="hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-lg transition duration-300"
        >
          {currentContent.buttonText}
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
