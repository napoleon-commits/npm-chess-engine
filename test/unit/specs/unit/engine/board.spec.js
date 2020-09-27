import { PCEINDEX, ResetBoard, GameBoard } from '@/utils/engine/board';
import { SQUARES, COLOURS, PIECES, BRD_SQ_NUM, SQ120 } from '@/utils/engine/defs';

describe('the tests inside the board.js file', () => {
  it('should test the PCEINDEX function', () => {
    const pce = Math.random();
    const pceNum = Math.random();
    expect(PCEINDEX(pce, pceNum)).toBe((pce * 10) + pceNum);
  });
  it('should test the ResetBoard function', () => {
    ResetBoard();
    let index = 0;
    for (index = 0; index < BRD_SQ_NUM; index += 1) {
      expect(GameBoard.pieces[index]).toBe(SQUARES.OFFBOARD);
    }
    for (index = 0; index < 64; index += 1) {
      expect(GameBoard.pieces[SQ120(index)]).toBe(PIECES.EMPTY);
    }
    for (index = 0; index < 14 * 120; index += 1) {
      expect(GameBoard.pList[index]).toBe(PIECES.EMPTY);
    }
    for (index = 0; index < 2; index += 1) {
      expect(GameBoard.material[index]).toBe(0);
    }
    for (index = 0; index < 13; index += 1) {
      expect(GameBoard.pceNum[index]).toBe(0);
    }
    expect(GameBoard.side).toBe(COLOURS.BOTH);
    expect(GameBoard.enPas).toBe(SQUARES.NO_SQ);
    expect(GameBoard.fiftyMove).toBe(0);
    expect(GameBoard.ply).toBe(0);
    expect(GameBoard.hisPly).toBe(0);
    expect(GameBoard.castlePerm).toBe(0);
    expect(GameBoard.posKey).toBe(0);
    expect(GameBoard.moveListStart[GameBoard.ply]).toBe(0);
  });
});
