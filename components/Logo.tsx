
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src="https://i.freeimage.host/fXldJlR.png" 
        alt="Athenaeum Arcanum Logo" 
        className="w-full h-full object-contain"
        style={{ 
          filter: `
            brightness(1.1) 
            contrast(1.1)
            drop-shadow(1px 0 0 #D4AF37) 
            drop-shadow(-1px 0 0 #D4AF37) 
            drop-shadow(0 1px 0 #D4AF37) 
            drop-shadow(0 -1px 0 #D4AF37)
            drop-shadow(0 0 12px rgba(212, 175, 55, 0.6))
          ` 
        }}
      />
    </div>
  );
};

export default Logo;
