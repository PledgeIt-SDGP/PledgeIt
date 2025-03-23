import React from "react";

function DailyQuotes() {
  const quotes = [
    "The best way to find yourself is to lose yourself in the service of others. – Mahatma Gandhi",
    "No act of kindness, no matter how small, is ever wasted. – Aesop",
    "Volunteers don’t get paid, not because they’re worthless, but because they’re priceless. – Sherry Anderson",
    "The smallest act of kindness is worth more than the grandest intention. – Oscar Wilde",
    "Service to others is the rent you pay for your room here on earth. – Muhammad Ali",
    "Alone we can do so little; together we can do so much. – Helen Keller",
  ];

  const today = new Date();
  const day = today.getDate();
  const quote = quotes[day % quotes.length]; // Rotate daily based on date

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center bg-orange-100 p-6 rounded-xl shadow-lg">
      {/* Left: Quote Section */}
      <div className="lg:w-1/2 text-center lg:text-left px-4">
        <h3 className="text-lg font-semibold text-orange-600">✨ Daily Inspiration ✨</h3>
        <p className="text-gray-700 italic text-xl mt-2">"{quote || 'Loading...'}"</p>
      </div>

      {/* Right: Image Section */}
      <div className="lg:w-1/2 flex justify-center">
        <img
          src="assests/bulb.png"
          alt="Volunteering"
          className="w-60 h-60 rounded-xl object-cover shadow-md"
        />
      </div>
    </div>
  );
}

export default DailyQuotes;
