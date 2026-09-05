import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  id: string;
  slotType?: 'header' | 'sidebar' | 'in-content' | 'footer' | 'top-banner';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, slotType = 'in-content', className = '' }) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignored if adblock or not ready yet
    }
  }, []);

  return (
    <div
      id={id}
      className={`ad-container mx-auto w-full max-w-4xl text-center overflow-hidden transition-all ${className}`}
      data-ad-slot-type={slotType}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8075321921383737"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

