export const translateReadingTime = stats => {
  if (!stats) {
    return "Unknown";
  }

  const minutes = Math.ceil(stats?.minutes || 0);
  let readingTimeText = '';

  switch (true) {
    case minutes < 1:
      readingTimeText = 'menos de 1 minuto';
      break;
    case minutes === 1:
      readingTimeText = '1 minuto';
      break;
    default:
      readingTimeText = `${minutes} minutos`;
      break;
  }
  return readingTimeText;
}
