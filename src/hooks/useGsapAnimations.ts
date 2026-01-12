import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Hook for hero pizza rotation animation
export const useHeroPizzaAnimation = () => {
  const pizzaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pizzaRef.current) return;

    const pizzaContainer = pizzaRef.current;

    // Set initial state to ensure consistent starting position
    // Preserve the translateY(50%) from CSS while setting rotation to 0
    gsap.set(pizzaContainer, {
      rotation: 0,
      y: '50%',
      transformOrigin: 'center center',
      force3D: true,
    });

    // Create rotation animation tied to scroll for the entire pizza
    // Important: include y: '50%' in the animation to preserve vertical position
    const scrollAnimation = gsap.to(pizzaContainer, {
      rotation: 90,
      y: '50%', // Keep the vertical position constant
      scrollTrigger: {
        trigger: '.pizza-main__hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true, // Recalculate on resize
        // markers: true, // Uncomment for debugging
      },
      transformOrigin: 'center center',
      ease: 'none',
      force3D: true,
    });

    return () => {
      if (scrollAnimation.scrollTrigger) {
        scrollAnimation.scrollTrigger.kill();
      }
      scrollAnimation.kill();
    };
  }, []);

  return pizzaRef;
};

// Hook for menu items stagger animation
export const useMenuItemsAnimation = (containerSelector: string) => {
  useEffect(() => {
    const menuItems = gsap.utils.toArray(`${containerSelector} .pizza-main__grid-item`);

    if (menuItems.length === 0) return;

    // Stagger animation for menu items bound to scroll depth
    const staggerAnimation = gsap.fromTo(
      menuItems,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerSelector,
          start: 'top 90%',
          end: 'top 25%',
          scrub: true,
        },
      }
    );

    return () => {
      staggerAnimation.kill();
    };
  }, [containerSelector]);
};

// Hook for burger items animation
export const useBurgerItemsAnimation = () => {
  useEffect(() => {
    const burgerItems = gsap.utils.toArray('.burger-section .burger-card');

    if (burgerItems.length === 0) return;

    const staggerAnimation = gsap.fromTo(
      burgerItems,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.burger-section__grid',
          start: 'top 90%',
          end: 'top 25%',
          scrub: true,
        },
      }
    );

    return () => {
      staggerAnimation.kill();
    };
  }, []);
};

// Hook for langos items animation
export const useLangosItemsAnimation = () => {
  useEffect(() => {
    const langosItems = gsap.utils.toArray('.langos-section .langos-card');

    if (langosItems.length === 0) return;

    const staggerAnimation = gsap.fromTo(
      langosItems,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.langos-section__grid',
          start: 'top 90%',
          end: 'top 25%',
          scrub: true,
        },
      }
    );

    return () => {
      staggerAnimation.kill();
    };
  }, []);
};

// Hook for prilohy items animation
export const usePrilohyItemsAnimation = () => {
  useEffect(() => {
    const prilohyItems = gsap.utils.toArray('.prilohy-section .prilohy-card');

    if (prilohyItems.length === 0) return;

    const staggerAnimation = gsap.fromTo(
      prilohyItems,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.prilohy-section__grid',
          start: 'top 100%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );

    return () => {
      staggerAnimation.kill();
    };
  }, []);
};

// Combined hook for all menu sections
export const useAllMenuAnimations = () => {
  useMenuItemsAnimation('.pizza-main__grid');
  useBurgerItemsAnimation();
  useLangosItemsAnimation();
  usePrilohyItemsAnimation();
};
