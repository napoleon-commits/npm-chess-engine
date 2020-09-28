import { ParseFen, PrintBoard } from './board';
import { PrintMoveList } from './io';

// eslint-disable-next-line
export function setFen(fenStr) {
  ParseFen(fenStr);
  PrintBoard();
  PrintMoveList();
}
