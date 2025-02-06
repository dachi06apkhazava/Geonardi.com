import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import GalleryPage from './pages/Gallery.jsx';
import Newsdetails from './pages/Newsdetails.jsx';
import Calendar from './pages/Calendar.jsx';
import Footer from './components/Footer.jsx';
import TournamentDetails from './pages/TournamentDetails.jsx';
import Partners from './pages/Partners.jsx';
import ContactForm from './pages/Contacts.jsx';
import Federation from './pages/Federation.jsx';
import FederationDetails from './pages/FederationDetails.jsx';
import Points from './pages/Points.jsx';
import Rules from './pages/Rules.jsx';
import LongRules from './pages/LongRules.jsx';
import Tournaments from './pages/Tournaments.jsx';
import TournamentSlug from './pages/TournamentSlug.jsx';
import CalendarLeaderboard from './components/CalendarLeaderboard.jsx';
import Results from './pages/Results.jsx';
import International from './pages/International.jsx';
import Champions from './pages/Champions.jsx';
import Archive from './pages/Archive.jsx';
import AdminRedirect from './components/AdminRedirect.jsx';
import { LanguageProvider } from './components/LanguageContext.jsx';
import ScrollToTop from './components/ScrollTop.jsx';
import { DataProvider } from './components/DataContext.jsx';
import TournamentRules from './pages/TournamentRule.jsx';

function AppContent() {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/federation" element={<Federation />} />
            <Route path="/federation/:id" element={<FederationDetails />} />
            <Route path="/news/:id" element={<Newsdetails />} />
            <Route path="/tournament/:id" element={<TournamentDetails />} />
            <Route path="/rules/scoring" element={<Points />} />
            <Route path="/rules/classical" element={<Rules />} />
            <Route path="/rules/tournament-rules" element={<TournamentRules />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentSlug />} />
            <Route path="/rules/long" element={<LongRules />} />
            <Route path="/rules/international" element={<International />} />
            <Route path="/rules/champions" element={<Champions />} />
            <Route path="/calendar/:id" element={<CalendarLeaderboard />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <DataProvider>
        <LanguageProvider>
          <ScrollToTop />
          <AppContent />
        </LanguageProvider>
      </DataProvider>
    </Router>
  );
}

export default App;
