import { PCEINDEX } from '@/utils/engine/board';

describe('the tests inside the board.js file', () => {
  it('should test the PCEINDEX function', () => {
    const pce = Math.random();
    const pceNum = Math.random();
    expect(PCEINDEX(pce, pceNum)).toBe((pce * 10) + pceNum);
  });
});
