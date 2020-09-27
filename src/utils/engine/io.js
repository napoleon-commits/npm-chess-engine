import { FileChar, FilesBrd, RankChar, RanksBrd } from './defs';

// eslint-disable-next-line
export function PrSq(sq) {
  return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}
