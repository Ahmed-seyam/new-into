import {useEffect, useRef} from 'react';

export default function Calendar() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && typeof window !== 'undefined') {
      Calendly?.initInlineWidget({
        url: 'https://calendly.com/customerservice-intoarchive/30min?hide_gdpr_banner=1&text_color=000000&primary_color=25824f',
        parentElement: document.getElementById('appointment-container'),
        prefill: {},
        utm: {},
        dataResize: true,
      });
      isInitialized.current = true;
    }
  }, []);

  return (
    <div className="appointment-calendar pt-14 text-white md:pt-0">
      <div id="appointment-container"></div>
    </div>
  );
}
