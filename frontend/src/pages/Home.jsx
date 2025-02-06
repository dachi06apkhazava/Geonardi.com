import React, { useRef } from 'react';
import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';
export default function Home() {

  return (
    <div className="overflow-y-auto">
      <Hero scrollToNews={() => document.getElementById('newsblock').scrollIntoView({ behavior: 'smooth' })} />
      <div id="newsblock">
        <Dashboard/>
      </div>
    </div>
  );
}
