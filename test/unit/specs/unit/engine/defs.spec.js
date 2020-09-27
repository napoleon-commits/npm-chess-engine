import { FR2SQ, RAND_32 } from '@/utils/engine/defs';

describe('the functions inside the def.js file', () => {
  it('should test the FR2SQ function', () => {
    const file = Math.floor(Math.random() * 12) + 1;
    const rank = Math.floor(Math.random() * 12) + 1;
    expect(FR2SQ(file, rank)).toBe(((21 + (file)) + ((rank) * 10)));
  });
  it('should test the RAND_32 function', () => {
    const randomNumber = RAND_32();
    expect(randomNumber).toBeLessThanOrEqual(2139095040);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
  });
});
