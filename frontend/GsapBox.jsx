import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GsapBox = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.to(boxRef.current, {
      x: 200,
      duration: 1.5,
      rotate: 360,
      backgroundColor: 'blue',
      ease: 'power2.out',
    });
  }, []);

  return 
};

export default GsapBox;
