/* eslint no-bitwise: ["error", { "allow": ["^","&"] }] */

import { SearchController, SearchPosition } from './search';
import { MakeMove, TakeMove } from './makemove';
import { BOOL, GameController, MAXDEPTH, COLOURS, GameBoard, Kings, PCEINDEX, PIECES, SQUARES, FilesBrd, RanksBrd, UserMove, TOSQ, MFLAGCA, MFLAGEP, PROMOTED, SQ120, START_FEN, CAPTURED, FR2SQ, NOMOVE } from './def';
import { GenerateMoves } from './movegen';
import { ParseFen, PrintBoard, SqAttacked } from './board';
import { PrSq, ParseMove } from './io';

// $("#SetFen").click(function () {
// var fenStr = $("#fenIn").val();
// NewGame(fenStr);
// });

function ClearAllPieces() {
  // $(".Piece").remove();
}
function AddGUIPiece() {

  // var file = FilesBrd[sq];
  // var rank = RanksBrd[sq];
  // var rankName = "rank" + (rank+1);
  // var fileName = "file" + (file+1);
  // var pieceFileName = "images/" +
// SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
  // var imageString = "<image src=\"" +
//   pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
  // $("#Board").append(imageString);
}
function SetInitialBoardPieces() {
  let sq;
  let sq120;
  let pce;

  ClearAllPieces();

  for (sq = 0; sq < 64; sq += 1) {
    sq120 = SQ120(sq);
    pce = GameBoard.pieces[sq120];
    if (pce >= PIECES.wP && pce <= PIECES.bK) {
      AddGUIPiece(sq120, pce);
    }
  }
}

function ThreeFoldRep() {
  let i = 0;
  let r = 0;

  for (i = 0; i < GameBoard.hisPly; i += 1) {
    if (GameBoard.history[i].posKey === GameBoard.posKey) {
      r += 1;
    }
  }
  return r;
}

export function DrawMaterial() {
  if (GameBoard.pceNum[PIECES.wP] !== 0 || GameBoard.pceNum[PIECES.bP] !== 0) return BOOL.FALSE;
  if (GameBoard.pceNum[PIECES.wQ] !== 0 || GameBoard.pceNum[PIECES.bQ] !== 0 ||
          GameBoard.pceNum[PIECES.wR] !== 0 || GameBoard.pceNum[PIECES.bR] !== 0) return BOOL.FALSE;
  if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) { return BOOL.FALSE; }
  if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) { return BOOL.FALSE; }

  if (GameBoard.pceNum[PIECES.wN] !== 0 && GameBoard.pceNum[PIECES.wB] !== 0) { return BOOL.FALSE; }
  if (GameBoard.pceNum[PIECES.bN] !== 0 && GameBoard.pceNum[PIECES.bB] !== 0) { return BOOL.FALSE; }

  return BOOL.TRUE;
}

function CheckResult() {
  if (GameBoard.fiftyMove >= 100) {
    //  $("#GameStatus").text("GAME DRAWN {fifty move rule}");
    return BOOL.TRUE;
  }

  if (ThreeFoldRep() >= 2) {
    // $("#GameStatus").text("GAME DRAWN {3-fold repetition}");
    return BOOL.TRUE;
  }

  if (DrawMaterial() === BOOL.TRUE) {
    // $("#GameStatus").text("GAME DRAWN {insufficient material to mate}");
    return BOOL.TRUE;
  }

  GenerateMoves();

  let MoveNum = 0;
  let found = 0;

  for (
    MoveNum = GameBoard.moveListStart[GameBoard.ply];
    MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
    MoveNum += 1
  ) {
    if (MakeMove(GameBoard.moveList[MoveNum]) === BOOL.FALSE) {
      // eslint-disable-next-line
      continue;
    }
    found += 1;
    TakeMove();
    break;
  }

  if (found !== 0) return BOOL.FALSE;

  const InCheck = SqAttacked(
    GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
    GameBoard.side ^ 1,
  );

  if (InCheck === BOOL.TRUE) {
    if (GameBoard.side === COLOURS.WHITE) {
      //   $("#GameStatus").text("GAME OVER {black mates}");
      return BOOL.TRUE;
    }
    //   $("#GameStatus").text("GAME OVER {white mates}");
    return BOOL.TRUE;
  } else {
    return BOOL.TRUE;
  }
  // $("#GameStatus").text("GAME DRAWN {stalemate}");return BOOL.TRUE;


  // return BOOL.FALSE;
}

function CheckAndSet() {
  if (CheckResult() === BOOL.TRUE) {
    GameController.GameOver = BOOL.TRUE;
  } else {
    GameController.GameOver = BOOL.FALSE;
    // $("#GameStatus").text('');
  }
}

export function NewGame(fenStr) {
  ParseFen(fenStr);
  PrintBoard();
  SetInitialBoardPieces();
  CheckAndSet();
}

export function setFen(fenStr) {
  NewGame(fenStr);
}

// $('#TakeButton').click( function () {
// if(GameBoard.hisPly > 0) {
// TakeMove();
// GameBoard.ply = 0;
// SetInitialBoardPieces();
// }
// });


export function takeBack() {
  if (GameBoard.hisPly > 0) {
    TakeMove();
    GameBoard.ply = 0;
    SetInitialBoardPieces();
  }
}

// $('#NewGameButton').click( function () {
// NewGame(START_FEN);
// });

export function newGameButton() {
  NewGame(START_FEN);
}

function DeSelectSq() {
// $('.Square').each( function(index) {
// if(PieceIsOnSq(sq, $(this).position().top, $(this).position().left) === BOOL.TRUE) {
// $(this).removeClass('SqSelected');
// }
// } );
}

export function SetSqSelected() {
// $('.Square').each( function(index) {
// if(PieceIsOnSq(sq, $(this).position().top, $(this).position().left) === BOOL.TRUE) {
// $(this).addClass('SqSelected');
// }
// } );
}

export function ClickedSquare(file, rank) {
  const sq = FR2SQ(file, rank);
  // eslint-disable-next-line
  console.log(`Clicked sq:${PrSq(sq)}`);
  SetSqSelected(sq);
  return sq;
}

function RemoveGUIPiece() {

  // $('.Piece').each( function(index) {
  // if(PieceIsOnSq(sq, $(this).position().top, $(this).position().left) === BOOL.TRUE) {
  // $(this).remove();
  // }
  // } );

}

function MoveGUIPiece(move) {
  // var from = FROMSQ(move);
  const to = TOSQ(move);

  if (move & MFLAGEP) {
    let epRemove;
    if (GameBoard.side === COLOURS.BLACK) {
      epRemove = to - 10;
    } else {
      epRemove = to + 10;
    }
    RemoveGUIPiece(epRemove);
  } else if (CAPTURED(move)) {
    RemoveGUIPiece(to);
  }

  // var file = FilesBrd[to];
  // var rank = RanksBrd[to];
  // var rankName = "rank" + (rank+1);
  // var fileName = "file" + (file+1);

  // $('.Piece').each( function(index) {
  // if(PieceIsOnSq(from, $(this).position().top, $(this).position().left) === BOOL.TRUE) {
  // $(this).removeClass();
  // $(this).addClass("Piece " + rankName + " " + fileName);
  // }
  // } );

  if (move & MFLAGCA) {
    switch (to) {
      case SQUARES.G1: RemoveGUIPiece(SQUARES.H1); AddGUIPiece(SQUARES.F1, PIECES.wR); break;
      case SQUARES.C1: RemoveGUIPiece(SQUARES.A1); AddGUIPiece(SQUARES.D1, PIECES.wR); break;
      case SQUARES.G8: RemoveGUIPiece(SQUARES.H8); AddGUIPiece(SQUARES.F8, PIECES.bR); break;
      case SQUARES.C8: RemoveGUIPiece(SQUARES.A8); AddGUIPiece(SQUARES.D8, PIECES.bR); break;
      default:
    }
  } else if (PROMOTED(move)) {
    RemoveGUIPiece(to);
    AddGUIPiece(to, PROMOTED(move));
  }
}

function StartSearch(thinkTimeChoice) {
  SearchController.depth = MAXDEPTH;
  // var t = $.now();
  const tt = thinkTimeChoice;

  SearchController.time = parseInt(tt, 10) * 1000;
  SearchPosition();

  MakeMove(SearchController.best);
  MoveGUIPiece(SearchController.best);
  CheckAndSet();
}

export function PreSearch(thinkingTime) {
  if (GameController.GameOver === BOOL.FALSE) {
    SearchController.thinking = BOOL.TRUE;
    StartSearch(thinkingTime);
  }
}

export function MakeUserMove(thinkingTime) {
  if (UserMove.from !== SQUARES.NO_SQ && UserMove.to !== SQUARES.NO_SQ) {
    //   eslint-disable-next-line
    console.log(`User Move:${PrSq(UserMove.from)}${PrSq(UserMove.to)}`);

    const parsed = ParseMove(UserMove.from, UserMove.to);

    if (parsed !== NOMOVE) {
      MakeMove(parsed);
      PrintBoard();
      MoveGUIPiece(parsed);
      CheckAndSet();
      PreSearch(thinkingTime);
    }

    DeSelectSq(UserMove.from);
    DeSelectSq(UserMove.to);

    UserMove.from = SQUARES.NO_SQ;
    UserMove.to = SQUARES.NO_SQ;
  }
}

export function ClickedPiece(file, rank, thinkingTime) {
  // eslint-disable-next-line
  console.log('Piece Click');

  if (UserMove.from === SQUARES.NO_SQ) {
    UserMove.from = ClickedSquare(file, rank);
  } else {
    UserMove.to = ClickedSquare(file, rank);
  }

  MakeUserMove(thinkingTime);
}

export function ClickedSpace(file, rank, thinkingTime) {
  // eslint-disable-next-line
  console.log('Square Click');
  if (UserMove.from !== SQUARES.NO_SQ) {
    UserMove.to = ClickedSquare(file, rank);
    MakeUserMove(thinkingTime);
  }
}

// $(document).on('click','.Piece', function (e) {
// console.log('Piece Click');

// if(UserMove.from === SQUARES.NO_SQ) {
// UserMove.from = ClickedSquare(e.pageX, e.pageY);
// } else {
// UserMove.to = ClickedSquare(e.pageX, e.pageY);
// }

// MakeUserMove();

// });

// $(document).on('click','.Square', function (e) {
// console.log('Square Click');
// if(UserMove.from !== SQUARES.NO_SQ) {
// UserMove.to = ClickedSquare(e.pageX, e.pageY);
// MakeUserMove();
// }

// });

export function PieceIsOnSq(sq, top, left) {
  if ((RanksBrd[sq] === 7 - Math.round(top / 60)) &&
        FilesBrd[sq] === Math.round(left / 60)) {
    return BOOL.TRUE;
  }

  return BOOL.FALSE;
}

// $('#SearchButton').click( function () {
// GameController.PlayerSide = GameController.side ^ 1;
// PreSearch();
// });

export function searchButton(thinkingTime) {
  GameController.PlayerSide = GameController.side ^ 1;
  PreSearch(thinkingTime);
}
