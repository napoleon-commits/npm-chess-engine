import { FR2SQ, RAND_32, SQ64, SQ120, Sq120ToSq64, Sq64ToSq120 } from '@/utils/engine/defs';
import { InitSq120To64 } from '@/utils/engine/main';

describe('the functions inside the def.js file', () => {
  it('should test the FR2SQ function', () => {
    const file = Math.floor(Math.random() * 12) + 1;
    const rank = Math.floor(Math.random() * 12) + 1;
    expect(FR2SQ(file, rank)).toBe(((21 + (file)) + ((rank) * 10)));
  });
  it('should test the RAND_32 function', () => {
    const randomNumber = RAND_32();
    expect(randomNumber).toBeLessThanOrEqual(2147483647);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
  });
  it('should test the SQ64 function', () => {
    InitSq120To64();
    const randomSquare = Math.floor(Math.random() * 121);
    expect(SQ64(randomSquare)).toBe(Sq120ToSq64[randomSquare]);
  });
  it('should test the SQ120 function', () => {
    InitSq120To64();
    const randomSquare = Math.floor(Math.random() * 65);
    expect(SQ120(randomSquare)).toBe(Sq64ToSq120[randomSquare]);
  });
});
