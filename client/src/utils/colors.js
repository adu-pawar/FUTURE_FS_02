// Generate a consistent color based on a string (e.g. user name)
const colors = [
  { bg: 'bg-blue-500', text: 'text-white', light: 'bg-blue-100', lightText: 'text-blue-700' },
  { bg: 'bg-emerald-500', text: 'text-white', light: 'bg-emerald-100', lightText: 'text-emerald-700' },
  { bg: 'bg-purple-500', text: 'text-white', light: 'bg-purple-100', lightText: 'text-purple-700' },
  { bg: 'bg-orange-500', text: 'text-white', light: 'bg-orange-100', lightText: 'text-orange-700' },
  { bg: 'bg-rose-500', text: 'text-white', light: 'bg-rose-100', lightText: 'text-rose-700' },
  { bg: 'bg-cyan-500', text: 'text-white', light: 'bg-cyan-100', lightText: 'text-cyan-700' },
  { bg: 'bg-amber-500', text: 'text-white', light: 'bg-amber-100', lightText: 'text-amber-700' },
  { bg: 'bg-indigo-500', text: 'text-white', light: 'bg-indigo-100', lightText: 'text-indigo-700' },
  { bg: 'bg-pink-500', text: 'text-white', light: 'bg-pink-100', lightText: 'text-pink-700' },
  { bg: 'bg-teal-500', text: 'text-white', light: 'bg-teal-100', lightText: 'text-teal-700' },
];

export const getColorForName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
