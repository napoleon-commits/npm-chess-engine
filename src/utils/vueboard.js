import blackBishop from '@/images/bB.png';
import blackKing from '@/images/bK.png';
import blackKnight from '@/images/bN.png';
import blackPawn from '@/images/bP.png';
import blackQueen from '@/images/bQ.png';
import blackRook from '@/images/bR.png';
import whiteBishop from '@/images/wB.png';
import whiteKing from '@/images/wK.png';
import whitePawn from '@/images/wP.png';
import whiteQueen from '@/images/wQ.png';
import whiteKnight from '@/images/wN.png';
import whiteRook from '@/images/wR.png';
import blankSquare from '@/images/blankSquare.png';
import { RANKS, FILES, FR2SQ, GameBoard, PceChar } from './def';

export const getHTMLChessPiece = (letter) => {
  if (letter === 'o') {
    return '<span class="text-dark" style="font-size: 16px;">&bull;</span>';
  }
  if (letter === 'x') {
    return '<span class="text-dark" style="font-size: 16px;">&times;</span>';
  }
  let imageSrc = null;
  switch (letter) {
    case 'r':
      imageSrc = blackRook; break;
    case 'n':
      imageSrc = blackKnight; break;
    case 'b':
      imageSrc = blackBishop; break;
    case 'q':
      imageSrc = blackQueen; break;
    case 'k':
      imageSrc = blackKing; break;
    case 'p':
      imageSrc = blackPawn; break;
    case 'R':
      imageSrc = whiteRook; break;
    case 'N':
      imageSrc = whiteKnight; break;
    case 'B':
      imageSrc = whiteBishop; break;
    case 'Q':
      imageSrc = whiteQueen; break;
    case 'K':
      imageSrc = whiteKing; break;
    case 'P':
      imageSrc = whitePawn; break;
    case '.':
      imageSrc = blankSquare; break;
    default:
  }

  return (
    `
      <img
        alt=${letter}
        style="display: block; max-width: 100%; max-height: 100%; margin: auto"
        src=${imageSrc}
      />
    `
  );
};

export const get2DBoard = () => {
  const JSXBoard = [];
  for (let rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank -= 1) {
    const row = [];
    for (let file = FILES.FILE_A; file <= FILES.FILE_H; file += 1) {
      const sq = FR2SQ(file, rank);
      const piece = GameBoard.pieces[sq];
      row.push(PceChar[piece]);
    }
    JSXBoard.push(row);
  }
  return (JSXBoard);
};
