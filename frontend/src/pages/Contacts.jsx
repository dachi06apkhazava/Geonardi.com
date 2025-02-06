import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDataContext } from '../components/DataContext';

const ContactForm = () => {
  const { baseUrl } = useDataContext();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { language } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/mails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });
      if (response.ok) {
        alert('Submission successful!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const translations = [
    [
      { key: 'contactTitle', value: 'Contact Us' },
      { key: 'namePlaceholder', value: 'Your Name' },
      { key: 'emailPlaceholder', value: 'Your Email' },
      { key: 'messagePlaceholder', value: 'Your Message' },
      { key: 'submitButton', value: 'Submit' },
    ],
    [
      { key: 'contactTitle', value: 'მოგვწერე' },
      { key: 'namePlaceholder', value: 'სახელი' },
      { key: 'emailPlaceholder', value: 'მეილი' },
      { key: 'messagePlaceholder', value: 'მესიჯი' },
      { key: 'submitButton', value: 'გაგზავნა' },
    ]
  ];

  const getTranslation = (key) => {
    const translationsForLanguage = language === 'en' ? translations[0] : translations[1];
    const translation = translationsForLanguage.find(t => t.key === key);
    return translation ? translation.value : key;
  };

  return (
    <div className="flex items-center text-center justify-center w-[80vw] flex-col md:flex-row pt-32 pb-10 mx-auto">
      <div className="w-full md:w-1/2 p-4">
        <h1 className="text-3xl font-bold mb-4">{getTranslation('contactTitle')}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder={getTranslation('namePlaceholder')}
            onChange={handleChange}
            value={formData.name}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder={getTranslation('emailPlaceholder')}
            onChange={handleChange}
            value={formData.email}
            className="border border-gray-300 rounded p-2"
            required
          />
          <textarea
            name="message"
            placeholder={getTranslation('messagePlaceholder')}
            onChange={handleChange}
            value={formData.message}
            className="border border-gray-300 rounded p-2"
            rows="8"
            required
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition">
            {getTranslation('submitButton')}
          </button>
        </form>
      </div>

      <div className="w-full md:w-1/2 p-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.5436032610082!2d44.80072572161117!3d41.69711652028722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440ce5df6222bf%3A0xf11607cadae74add!2zMTUg4YOQ4YOc4YOi4YOd4YOcIOGDpOGDo-GDoOGDquGDlOGDmuGDkOGDq-GDmOGDoSDhg6Xhg6Phg6nhg5AsIOGDl-GDkeGDmOGDmuGDmOGDoeGDmA!5e1!3m2!1ska!2sge!4v1729513145963!5m2!1ska!2sge"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactForm;
