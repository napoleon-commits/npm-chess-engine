import { InitFilesRanksBrd, InitHashKeys } from '@/utils/engine/main';
import { FilesBrd, RanksBrd, FR2SQ, PieceKeys, SideKey, CastleKeys } from '@/utils/engine/defs';

describe('the tests for the functions inside main', () => {
  it('should test the InitFilesRanksBrd function', () => {
    InitFilesRanksBrd();
    for (let rank = 0; rank < 8; rank += 1) {
      for (let file = 0; file < 8; file += 1) {
        expect(FilesBrd[FR2SQ(file, rank)]).toBe(file);
        expect(RanksBrd[FR2SQ(file, rank)]).toBe(rank);
      }
    }
  });
  it('should test the InitHashKeys function', () => {
    InitHashKeys();
    for (let i = 0; i < (14 * 120); i += 1) {
      expect(PieceKeys[i]).toBeGreaterThanOrEqual(0);
      expect(PieceKeys[i]).toBeLessThanOrEqual(2147483647);
    }
    expect(SideKey[0]).toBeGreaterThanOrEqual(0);
    expect(SideKey[0]).toBeLessThanOrEqual(2147483647);
    for (let i = 0; i < 16; i += 1) {
      expect(CastleKeys[i]).toBeGreaterThanOrEqual(0);
      expect(CastleKeys[i]).toBeLessThanOrEqual(2147483647);
    }
  });
});
