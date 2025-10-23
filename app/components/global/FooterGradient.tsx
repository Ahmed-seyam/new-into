'use client';
import {useEffect, useRef, useState} from 'react';

export default function FooterGradient() {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!ref.current?.offsetParent) return;
    const scrollY = window.scrollY;
    const offsetTop = (ref.current.offsetParent as HTMLElement).offsetTop;
    const h = scrollY - offsetTop + window.innerHeight;
    setHeight(h);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        height: `${height}px`,
        background: `linear-gradient(180deg, #FFFFFF 0%, #1d663e 100%)`,
      }}
      className="absolute left-0 bottom-0 w-full"
    />
  );
}
