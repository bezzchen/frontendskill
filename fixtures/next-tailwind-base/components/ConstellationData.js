export const constellationItems = Array.from({ length: 500 }, (_, index) => ({
  id: index,
  label: `Node ${index + 1}`,
  category: ["engineering", "research", "design", "math"][index % 4],
}));
