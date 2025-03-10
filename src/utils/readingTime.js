const customRound = (num) => {
  return (num % 1) < 0.5 ? Math.floor(num) : Math.ceil(num);
}

export const translateReadingTime = stats => {
  if (!stats) {
    return "Unknown";
  }

  const minutes = customRound(stats?.minutes || 0);
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
