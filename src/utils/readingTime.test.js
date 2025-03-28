import { translateReadingTime } from './readingTime';

describe('translateReadingTime', () => {
  it('should return "Unknown" if stats is undefined', () => {
    expect(translateReadingTime(undefined)).toBe("Unknown");
  });

  it('should return "menos de 1 minuto" for less than 1 minute', () => {
    expect(translateReadingTime({ minutes: 0.4 })).toBe("menos de 1 minuto");
  });

  it('should return "menos de 1 minuto" for less than 1 minute', () => {
    expect(translateReadingTime({ minutes: 0.5 })).toBe("1 minuto");
  });

  it('should return "1 minuto" for exactly 1 minute', () => {
    expect(translateReadingTime({ minutes: 1 })).toBe("1 minuto");
  });

  it('should return "2 minutos" for 2 minutes', () => {
    expect(translateReadingTime({ minutes: 2 })).toBe("2 minutos");
  });

  it('should round up to the nearest minute', () => {
    expect(translateReadingTime({ minutes: 1.4 })).toBe("1 minuto");
  });
  it('should round up to the nearest minute', () => {
    expect(translateReadingTime({ minutes: 1.6 })).toBe("2 minutos");
  });
});
