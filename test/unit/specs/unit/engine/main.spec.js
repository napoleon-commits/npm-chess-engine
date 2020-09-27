import { InitFilesRanksBrd } from '@/utils/engine/main';
import { FilesBrd, RanksBrd, FR2SQ } from '@/utils/engine/defs';

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
});
