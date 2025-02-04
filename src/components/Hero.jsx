import React from "react";
import HeroContent from "./hero/HeroContent";
import HeroFeature from "./hero/HeroFeature";

function hero() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center">
      <HeroContent />
      <HeroFeature />
    </div>
  );
}

export default hero;
