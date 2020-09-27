import { FR2SQ } from '@/utils/engine/defs';

describe('the functions inside the def.js file', () => {
  it('should test the FR2SQ function', () => {
    const file = Math.floor(Math.random() * 12) + 1;
    const rank = Math.floor(Math.random() * 12) + 1;
    expect(FR2SQ(file, rank)).toBe(((21 + (file)) + ((rank) * 10)));
  });
});
