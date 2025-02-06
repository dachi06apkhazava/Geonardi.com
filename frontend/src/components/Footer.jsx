import React, { useEffect, useState } from 'react';
import { Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useDataContext } from './DataContext';

export default function Footer() {
  const { language } = useLanguage();
  const { baseUrl } = useDataContext();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/footer?locale=${language}`);

        if (!response.ok) {
          throw new Error('Failed to fetch footer data');
        }

        const data = await response.json();
        setFooterData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [language, baseUrl]);

  if (loading) return <div>Loading footer...</div>;
  if (error) return <div>Error: {error}</div>;

  const footerText = [
    {
      title: 'Georgian Sports Backgammon Federation',
      link: 'Tbilisi Backgammon Federation',
      address: footerData?.adress || 'Your Address Here',
      phone: footerData?.number || 'Your Phone Number Here',
      email: footerData?.mail || 'Your Email Here',
    },
    {
      title: 'საქართველოს სპორტული ნარდის ფედერაცია',
      link: 'თბილისის ნარდის ფედერაცია',
      address: footerData?.adress || 'Your Address Here',
      phone: footerData?.number || 'Your Phone Number Here',
      email: footerData?.mail || 'Your Email Here',
    }
  ];

  const currentFooterText = language === 'ka-GE' ? footerText[1] : footerText[0];

  return (
    <footer style={{ backgroundColor: '#195c72' }} className="text-white py-8 px-4 md:px-8 w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">{currentFooterText.title}</h2>
            <div className="flex flex-col space-y-2">
              <a
                href="https://www.facebook.com/profile.php?id=100063671695316"
                className="flex items-center hover:text-teal-300 transition-colors"
              >
                <Facebook size={24} className="mr-2" />
                <span className="text-sm">{currentFooterText.title}</span>
              </a>
              <a
                href="https://www.facebook.com/tbfederation/"
                className="flex items-center hover:text-teal-300 transition-colors"
              >
                <Facebook size={24} className="mr-2" />
                <span className="text-sm">{currentFooterText.link}</span>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2 text-teal-300 flex-shrink-0" />
              <span>{currentFooterText.address}</span>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="mr-2 text-teal-300 flex-shrink-0" />
              <span>{currentFooterText.phone}</span>
            </div>
            <div className="flex items-center col-span-full">
              <Mail size={18} className="mr-2 text-teal-300 flex-shrink-0" />
              <span>{currentFooterText.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-teal-700 text-center text-xs">
          © 2024 {currentFooterText.title}.
        </div>
      </div>
    </footer>
  );
}
