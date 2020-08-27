export default function getTheme(level) {
  const themes = {
    1: 'prairie',
    2: 'desert',
    3: 'arctic',
    4: 'mountain',
  };

  return themes[level];
}
