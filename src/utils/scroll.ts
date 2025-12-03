export const scrollTo = (sectionId: string) => {
  const menuSection = document.querySelector(sectionId);
  menuSection?.scrollIntoView({ behavior: 'smooth' });
};
