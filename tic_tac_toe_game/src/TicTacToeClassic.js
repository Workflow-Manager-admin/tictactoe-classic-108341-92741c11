import React, { useState } from "react";

/*
  TicTacToeClassic.js
  Main container component for classic two-player Tic Tac Toe game.
  Features: 
    - Two-player alternating play (X/O)
    - Move tracking and game board state
    - Win and draw detection
    - Displays current turn and game result
    - Light theme, stylized according to theme/colors
    - Restart button to reset game
*/

// PUBLIC_INTERFACE
function TicTacToeClassic() {
  // Set up initial board state (array of 9 nulls), X always starts
  const initialBoard = Array(9).fill(null);

  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("ongoing"); // 'ongoing', 'win', 'draw'
  const [winner, setWinner] = useState(null);

  // Winning line indices for 3x3 grid
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    // Do not allow move if win/draw or not empty
    if (status !== "ongoing" || board[idx]) return;
    const nextBoard = board.slice();
    nextBoard[idx] = isXNext ? "X" : "O";
    setBoard(nextBoard);

    // Check for a win
    const gameResult = checkGameResult(nextBoard);
    if (gameResult.status === "win") {
      setStatus("win");
      setWinner(gameResult.winner);
    } else if (gameResult.status === "draw") {
      setStatus("draw");
      setWinner(null);
    } else {
      setIsXNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function checkGameResult(b) {
    // Check for win
    for (let [a, bIdx, c] of WIN_LINES) {
      if (
        b[a] &&
        b[a] === b[bIdx] &&
        b[a] === b[c]
      ) {
        return { status: "win", winner: b[a] };
      }
    }
    // Check for draw (no null cells left)
    if (b.every((cell) => cell !== null)) {
      return { status: "draw" };
    }
    // Game ongoing
    return { status: "ongoing" };
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(initialBoard);
    setIsXNext(true);
    setStatus("ongoing");
    setWinner(null);
  }

  // Compute dynamic label and styles
  let playerLabel = isXNext ? "Player X" : "Player O";

  let gameStatusMsg;
  if (status === "win") {
    gameStatusMsg = (
      <span style={{ color: "var(--accent, #FF9800)", fontWeight: 600 }}>
        {winner === "X" ? "Player X" : "Player O"} wins!
      </span>
    );
  } else if (status === "draw") {
    gameStatusMsg = (
      <span style={{ color: "#888", fontWeight: 600 }}>It's a draw!</span>
    );
  } else {
    gameStatusMsg = (
      <>
        <span style={{ color: "var(--primary, #2196F3)", fontWeight: 500 }}>
          {playerLabel}
        </span>
        {"'s turn"}
      </>
    );
  }

  // Theme palette
  const palette = {
    primary: "#2196F3",
    secondary: "#FFFFFF",
    accent: "#FF9800",
    border: "#e0e0e0",
    cellHover: "#e3f2fd",
    cellActive: "#bbdefb",
    boardBg: "#ffffff",
    boardShadow: "#d1e3fa",
  };

  // Inline styles scoped to this component to match light theme & requirements
  const styles = {
    outer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "48px",
      fontFamily:
        "'Inter','Roboto','Helvetica','Arial',sans-serif",
    },
    title: {
      fontSize: "2.2rem",
      fontWeight: 600,
      color: palette.primary,
      marginBottom: 8,
      letterSpacing: "0.02em",
    },
    playerTurn: {
      margin: "0 0 18px 0",
      fontSize: "1.13rem",
      fontWeight: 500,
      minHeight: 32,
      textAlign: "center",
      color: "#222",
    },
    board: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 60px)",
      gridTemplateRows: "repeat(3, 60px)",
      gap: "6px",
      background: palette.boardBg,
      border: `3px solid ${palette.primary}`,
      borderRadius: "10px",
      boxShadow: `0 6px 18px 0 ${palette.boardShadow}44`,
      padding: 10,
      marginBottom: 24,
    },
    cell: {
      width: 60,
      height: 60,
      background: "#f9fafd",
      border: `1.5px solid ${palette.border}`,
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.35rem",
      fontWeight: 700,
      color: palette.primary,
      cursor: "pointer",
      transition: "background 0.13s, box-shadow 0.13s",
      boxShadow: "0 1px 6px 0 #eee",
      outline: "none",
      userSelect: "none",
    },
    cellDisabled: {
      background: "#f1eeee",
      color: "#b0b0b0",
      cursor: "default",
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    },
    btn: {
      background: palette.primary,
      color: palette.secondary,
      border: "none",
      borderRadius: 4,
      fontSize: "1rem",
      padding: "9px 22px",
      fontWeight: 500,
      marginTop: 2,
      cursor: "pointer",
      transition: "background 0.18s",
      outline: "none",
      boxShadow: `0 2px 6px 0 ${palette.boardShadow}40`,
      letterSpacing: "0.01em",
    },
    btnHover: {
      background: palette.accent,
    },
  };

  // PUBLIC_INTERFACE
  // Cell rendering with hover handling for mouse feedback (without huge state churn)
  function TicTacToeCell({ value, onClick, disabled }) {
    const [hover, setHover] = useState(false);

    let cellStyle = { ...styles.cell };
    if (hover && !disabled) {
      cellStyle.background = palette.cellHover;
      cellStyle.boxShadow = `0 2px 10px 0 ${palette.primary}16`;
    }
    if (disabled) {
      cellStyle = { ...cellStyle, ...styles.cellDisabled };
    }
    return (
      <button
        type="button"
        style={cellStyle}
        onClick={onClick}
        disabled={disabled}
        tabIndex={0}
        aria-label={value ? `Cell with ${value}` : "Empty cell"}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {value}
      </button>
    );
  }

  return (
    <div style={styles.outer}>
      <div style={styles.title}>Tic Tac Toe Classic</div>
      <div style={styles.playerTurn}>{gameStatusMsg}</div>
      <div style={styles.board} role="grid" aria-label="tic tac toe board">
        {board.map((cell, idx) => (
          <TicTacToeCell
            key={idx}
            value={cell}
            onClick={() => handleCellClick(idx)}
            disabled={Boolean(cell) || status !== "ongoing"}
          />
        ))}
      </div>
      <div style={styles.footer}>
        <button
          style={styles.btn}
          onClick={handleRestart}
        >
          Restart Game
        </button>
        {status !== "ongoing" && (
          <div
            style={{
              fontSize: "1.08rem",
              color: palette.accent,
              marginTop: 5,
              letterSpacing: "0.01em",
              fontWeight: 500,
            }}
          >
            {status === "win"
              ? `${winner === "X" ? "Player X" : "Player O"} is the winner!`
              : "Game ended in a draw."}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicTacToeClassic;
