import { InitFilesRanksBrd, InitHashKeys, InitSq120To64 } from '@/utils/engine/main';
import { FilesBrd, RanksBrd, FR2SQ, PieceKeys, SideKey, CastleKeys, Sq64ToSq120, Sq120ToSq64, RANKS, FILES } from '@/utils/engine/defs';

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
  it('should test the InitSq120To64 function', () => {
    InitSq120To64();
    for (let rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank += 1) {
      for (let file = FILES.FILE_A; file <= FILES.FILE_H; file += 1) {
        expect(Sq64ToSq120[((rank * 8) + file)]).toBe(FR2SQ(file, rank));
        expect(Sq120ToSq64[FR2SQ(file, rank)]).toBe(((rank * 8) + file));
      }
    }
  });
});
