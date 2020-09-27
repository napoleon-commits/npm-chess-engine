import { ParseFen, PrintBoard } from './board';

// eslint-disable-next-line
export function setFen(fenStr) {
  ParseFen(fenStr);
  PrintBoard();
}
