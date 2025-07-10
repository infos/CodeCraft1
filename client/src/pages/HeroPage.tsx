import React, { useState } from 'react';
import { CalendarIcon, Users, ChevronDownIcon } from 'lucide-react';

function Hero({ startDate, duration, onDateChange, onDurationChange, durations }: {
  startDate: string;
  duration: number;
  onDateChange: (date: string) => void;
  onDurationChange: (duration: number) => void;
  durations: number[];
}) {
  return (
    <header className="relative h-[80vh] md:h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/heritage-hero.svg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Narrative + Controls */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-white font-serif text-5xl md:text-6xl mb-4">
          Embark on a 5–12 Day Heritage Journey
        </h1>
        <p className="text-gray-200 max-w-2xl mb-8 text-lg md:text-xl">
          Step back in time and wander through ancient ruins, hidden frescoes,
          and storied monuments. Choose your dates and let history unfold
          before you.
        </p>

        {/* Search Controls */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-2xl">
          <div className="flex items-center w-full md:w-1/2 border border-gray-300 rounded-lg p-2">
            <CalendarIcon className="h-6 w-6 text-gray-500 mr-2" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>

          <div className="relative flex items-center w-full md:w-1/3 border border-gray-300 rounded-lg p-2">
            <Users className="h-6 w-6 text-gray-500 mr-2" />
            <select
              value={duration}
              onChange={(e) => onDurationChange(+e.target.value)}
              className="w-full pr-8 outline-none bg-transparent"
            >
              {durations.map((d) => (
                <option key={d} value={d}>{d} days</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg px-6 py-3 md:mt-0 w-full md:w-auto">
            Find Tours
          </button>
        </div>
      </div>
    </header>
  );
}

export default function HeroPage() {
  const [startDate, setStartDate] = useState('2024-03-01');
  const [duration, setDuration] = useState(7);
  const durations = [5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        startDate={startDate}
        duration={duration}
        onDateChange={setStartDate}
        onDurationChange={setDuration}
        durations={durations}
      />
      
      {/* Additional content section */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-serif text-gray-800 mb-6 text-center">
          Discover Ancient Wonders
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed text-center">
          From the pyramids of Egypt to the ruins of Rome, immerse yourself in the stories 
          that shaped our world. Our heritage tours combine expert guidance with authentic 
          cultural experiences, bringing history to life in unforgettable ways.
        </p>
      </div>
    </div>
  );
}