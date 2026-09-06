import React, { useEffect, useRef, useState } from 'react';

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
  const [adStatus, setAdStatus] = useState<'pending' | 'filled' | 'unfilled'>('pending');

  useEffect(() => {
    const el = adRef.current;
    if (!el) return;

    let timeoutId: number | undefined;

    // Check current state of the ins element
    const checkFillState = () => {
      if (!el) return;
      const status = el.getAttribute('data-ad-status');
      const adsStatus = el.getAttribute('data-adsbygoogle-status');

      if (status === 'filled') {
        setAdStatus('filled');
        return;
      }
      if (status === 'unfilled') {
        setAdStatus('unfilled');
        return;
      }

      // Check if iframe was injected with non-zero dimensions
      const iframe = el.querySelector('iframe');
      if (iframe && el.offsetHeight > 20 && status !== 'unfilled') {
        setAdStatus('filled');
        return;
      }

      // If AdSense finished processing but didn't fill
      if (adsStatus === 'done' && status !== 'filled') {
        setAdStatus('unfilled');
        return;
      }
    };

    // Observer to detect AdSense DOM modifications & attribute updates
    const observer = new MutationObserver(() => {
      checkFillState();
    });

    observer.observe(el, {
      attributes: true,
      attributeFilter: ['data-ad-status', 'data-adsbygoogle-status', 'style'],
      childList: true,
      subtree: true,
    });

    // Request ad from AdSense
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      setAdStatus('unfilled');
    }

    // Safety timeout: if after 2000ms no ad is filled (unapproved account, preview URL, adblock, etc.), collapse
    timeoutId = window.setTimeout(() => {
      if (!el) {
        setAdStatus('unfilled');
        return;
      }
      const currentStatus = el.getAttribute('data-ad-status');
      if (currentStatus === 'filled' || (el.querySelector('iframe') && el.offsetHeight > 20)) {
        setAdStatus('filled');
      } else {
        setAdStatus('unfilled');
      }
    }, 2000);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const isFilled = adStatus === 'filled';
  const isUnfilled = adStatus === 'unfilled';

  // When unfilled or unapproved, collapse completely: no space, no gap, no border
  if (isUnfilled) {
    return (
      <div
        id={id}
        className="ad-container ad-unfilled ad-collapsed hidden"
        style={{ display: 'none' }}
        data-ad-slot-type={slotType}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      id={id}
      className={`ad-container mx-auto w-full max-w-4xl text-center transition-all duration-300 ${
        isFilled ? `opacity-100 ${className}` : 'ad-pending h-0 max-h-0 min-h-0 overflow-hidden opacity-0 m-0 p-0 pointer-events-none'
      }`}
      style={{
        display: isFilled ? 'block' : 'block', // Must be block for AdSense to read offsetWidth during pending
        height: isFilled ? 'auto' : 0,
        maxHeight: isFilled ? 'none' : 0,
        overflow: isFilled ? 'visible' : 'hidden',
        margin: isFilled ? undefined : 0,
        padding: isFilled ? undefined : 0,
      }}
      data-ad-slot-type={slotType}
      data-status={adStatus}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          background: 'transparent',
          border: 'none',
        }}
        data-ad-client="ca-pub-8075321921383737"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
