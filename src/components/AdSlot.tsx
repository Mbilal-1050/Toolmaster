import React, { useEffect } from 'react';

interface AdSlotProps {
  id: string;
  slotType?: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, slotType = 'in-content', className = '' }) => {
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
      className={`my-4 mx-auto w-full max-w-4xl text-center overflow-hidden min-h-[90px] flex items-center justify-center ${className}`}
      data-ad-slot-type={slotType}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '280px', minHeight: '90px' }}
        data-ad-client="ca-pub-8075321921383737"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

