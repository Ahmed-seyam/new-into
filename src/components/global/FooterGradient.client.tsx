'use client';
import {useEffect, useRef, useState} from 'react';

export default function FooterGradient() {
  const [height, setHeight] = useState(0);
  const ref = useRef();
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const h = scrollY - ref.current.offsetParent.offsetTop + window.innerHeight;
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
    ></div>
  );
}
