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
    <div className="relative flex flex-col lg:flex-row items-center justify-center lg:mt-0 ">
        <img
          src="https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658578/bg1_o0bjsb.jpg"
          alt="image 3"
          className="h-99 w-full object-cover rounded-xl shadow-lg"
        />
      {/* Left: Quote Section */}
      <div className="absolute lg:w-3/4 text-center">
        <h3 className="text-2xl pb-7 font-semibold ">✨ Daily Inspiration ✨</h3>
        <p className="text-gray-700 italic text-xl m-2 p-3">"{quote || 'Loading...'}"</p>
      </div>
    </div>
  );
}

export default DailyQuotes;
