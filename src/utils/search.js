/* eslint no-bitwise: ["error", { "allow": ["&","^"] }] */
import $ from 'jquery';
import { INFINITE, BOOL, MATE, MAXDEPTH, NOMOVE, GameBoard, BRD_SQ_NUM, TOSQ, FROMSQ, PCEINDEX, MFLAGCAP, Kings, PVENTRIES, MoveStats } from './def';
import { GenerateMoves, GenerateCaptures } from './movegen';
import { SqAttacked } from './board';
import { MakeMove, TakeMove } from './makemove';
import { PrMove } from './io';
import { GetPvLine, ProbePvTable, StorePvMove } from './pvtable';
import EvalPosition from './evaluate';

export const SearchController = {
  nodes: undefined,
  fh: undefined,
  fhf: undefined,
  depth: undefined,
  time: undefined,
  start: undefined,
  stop: undefined,
  best: undefined,
  thinking: undefined,
};

function PickNextMove(MoveNum) {
  let index = 0;
  let bestScore = -1;
  let bestNum = MoveNum;

  for (index = MoveNum; index < GameBoard.moveListStart[GameBoard.ply + 1]; index += 1) {
    if (GameBoard.moveScores[index] > bestScore) {
      bestScore = GameBoard.moveScores[index];
      bestNum = index;
    }
  }

  if (bestNum !== MoveNum) {
    let temp = 0;
    temp = GameBoard.moveScores[MoveNum];
    GameBoard.moveScores[MoveNum] = GameBoard.moveScores[bestNum];
    GameBoard.moveScores[bestNum] = temp;

    temp = GameBoard.moveList[MoveNum];
    GameBoard.moveList[MoveNum] = GameBoard.moveList[bestNum];
    GameBoard.moveList[bestNum] = temp;
  }
}

function ClearPvTable() {
  let index;
  for (index = 0; index < PVENTRIES; index += 1) {
    GameBoard.PvTable[index].move = NOMOVE;
    GameBoard.PvTable[index].posKey = 0;
  }
}

function CheckUp() {
  if (($.now() - SearchController.start) > SearchController.time) {
    SearchController.stop = BOOL.TRUE;
  }
}

function IsRepetition() {
  let index = 0;

  for (
    index = GameBoard.hisPly - GameBoard.fiftyMove;
    index < GameBoard.hisPly - 1;
    index += 1
  ) {
    if (GameBoard.posKey === GameBoard.history[index].posKey) {
      return BOOL.TRUE;
    }
  }

  return BOOL.FALSE;
}

function Quiescence(alpha, beta) {
  let tAlpha = alpha;
  const tBeta = beta;
  if ((SearchController.nodes & 2047) === 0) {
    CheckUp();
  }

  SearchController.nodes += 1;

  if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply !== 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  let Score = EvalPosition();

  if (Score >= tBeta) {
    return tBeta;
  }

  if (Score > tAlpha) {
    tAlpha = Score;
  }

  GenerateCaptures();

  let MoveNum = 0;
  let Legal = 0;
  const OldAlpha = tAlpha;
  let BestMove = NOMOVE;
  let Move = NOMOVE;

  for (
    MoveNum = GameBoard.moveListStart[GameBoard.ply];
    MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
    MoveNum += 1
  ) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];

    if (MakeMove(Move) === BOOL.FALSE) {
      // eslint-disable-next-line
      continue;
    }
    Legal += 1;
    Score = -Quiescence(-tBeta, -tAlpha);

    TakeMove();

    if (SearchController.stop === BOOL.TRUE) {
      return 0;
    }

    if (Score > tAlpha) {
      if (Score >= tBeta) {
        if (Legal === 1) {
          SearchController.fhf += 1;
        }
        SearchController.fh += 1;
        return tBeta;
      }
      tAlpha = Score;
      BestMove = Move;
    }
  }

  if (tAlpha !== OldAlpha) {
    StorePvMove(BestMove);
  }

  return tAlpha;
}

function AlphaBeta(alpha, beta, depth) {
  let tAlpha = alpha;
  const tBeta = beta;
  let tDepth = depth;
  if (tDepth <= 0) {
    return Quiescence(tAlpha, tBeta);
  }

  if ((SearchController.nodes & 2047) === 0) {
    CheckUp();
  }

  SearchController.nodes += 1;

  if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply !== 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  const InCheck = SqAttacked(
    GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
    GameBoard.side ^ 1,
  );
  if (InCheck === BOOL.TRUE) {
    tDepth += 1;
  }

  let Score = -INFINITE;

  GenerateMoves();

  let MoveNum = 0;
  let Legal = 0;
  const OldAlpha = tAlpha;
  let BestMove = NOMOVE;
  let Move = NOMOVE;

  const PvMove = ProbePvTable();
  if (PvMove !== NOMOVE) {
    for (
      MoveNum = GameBoard.moveListStart[GameBoard.ply];
      MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
      MoveNum += 1
    ) {
      if (GameBoard.moveList[MoveNum] === PvMove) {
        GameBoard.moveScores[MoveNum] = 2000000;
        break;
      }
    }
  }

  for (
    MoveNum = GameBoard.moveListStart[GameBoard.ply];
    MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
    MoveNum += 1
  ) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];

    if (MakeMove(Move) === BOOL.FALSE) {
      // eslint-disable-next-line
      continue;
    }
    Legal += 1;
    Score = -AlphaBeta(-tBeta, -tAlpha, tDepth - 1);

    TakeMove();

    if (SearchController.stop === BOOL.TRUE) {
      return 0;
    }

    if (Score > tAlpha) {
      if (Score >= tBeta) {
        if (Legal === 1) {
          SearchController.fhf += 1;
        }
        SearchController.fh += 1;
        if ((Move & MFLAGCAP) === 0) {
          GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] =
GameBoard.searchKillers[GameBoard.ply];
          GameBoard.searchKillers[GameBoard.ply] = Move;
        }
        return tBeta;
      }
      if ((Move & MFLAGCAP) === 0) {
        GameBoard.searchHistory[(GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM) + TOSQ(Move)]
+= tDepth * tDepth;
      }
      tAlpha = Score;
      BestMove = Move;
    }
  }

  if (Legal === 0) {
    if (InCheck === BOOL.TRUE) {
      return -MATE + GameBoard.ply;
    }
    return 0;
  }

  if (tAlpha !== OldAlpha) {
    StorePvMove(BestMove);
  }

  return tAlpha;
}

function ClearForSearch() {
  let index = 0;

  for (index = 0; index < 14 * BRD_SQ_NUM; index += 1) {
    GameBoard.searchHistory[index] = 0;
  }

  for (index = 0; index < 3 * MAXDEPTH; index += 1) {
    GameBoard.searchKillers[index] = 0;
  }

  ClearPvTable();
  GameBoard.ply = 0;
  SearchController.nodes = 0;
  SearchController.fh = 0;
  SearchController.fhf = 0;
  SearchController.start = $.now();
  SearchController.stop = BOOL.FALSE;
}

function UpdateMoveStats(domScore, domDepth) {
  let scoreText = (domScore / 100).toFixed(2);
  if (Math.abs(domScore) > MATE - MAXDEPTH) {
    scoreText = `Mate In ${MATE - (Math.abs(domScore)) - 1} moves`;
  }

  MoveStats.Ordering = `${((SearchController.fhf / SearchController.fh) * 100).toFixed(2)}%`;
  MoveStats.Depth = domDepth;
  MoveStats.Score = scoreText;
  MoveStats.Nodes = SearchController.nodes;
  MoveStats.Time = `${(($.now() - SearchController.start) / 1000).toFixed(1)}s`;
  MoveStats.BestMove = PrMove(SearchController.best);
}

export function SearchPosition() {
  let bestMove = NOMOVE;
  let bestScore = -INFINITE;
  let Score = -INFINITE;
  let currentDepth = 0;
  let line;
  let PvNum;
  let c;
  ClearForSearch();

  for (currentDepth = 1; currentDepth <= SearchController.depth; currentDepth += 1) {
    Score = AlphaBeta(-INFINITE, INFINITE, currentDepth);

    if (SearchController.stop === BOOL.TRUE) {
      break;
    }

    bestScore = Score;
    bestMove = ProbePvTable();
    line = `D:${currentDepth} Best:${PrMove(bestMove)} Score:${bestScore
    } nodes:${SearchController.nodes}`;

    PvNum = GetPvLine(currentDepth);
    line += ' Pv:';
    for (c = 0; c < PvNum; c += 1) {
      line += ` ${PrMove(GameBoard.PvArray[c])}`;
    }
    if (currentDepth !== 1) {
      line += (` Ordering:${((SearchController.fhf / SearchController.fh) * 100).toFixed(2)}%`);
    }
    // eslint-disable-next-line
    console.log(line);
  }

  SearchController.best = bestMove;
  SearchController.thinking = BOOL.FALSE;
  UpdateMoveStats(bestScore, currentDepth);
}
