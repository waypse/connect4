import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, SafeAreaView, Button, Pressable} from 'react-native';
import {useEffect, useState} from "react";

export default function App() {
  const player1 = 1
  const player2 = 2
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')

  function initBoard() {
    // Create a blank 6x7 matrix
    let board = [];
    for (let r = 0; r < 6; r++) {
      let row = [];
      for (let c = 0; c < 7; c++) { row.push(null) }
      board.push(row);
    }

    setBoard(board)
    setGameOver(false)
    setCurrentPlayer(player1)
    setMessage('')
  }

  function togglePlayer() {
    return (currentPlayer === player1) ? player2 : player1
  }

  function play(c) {
    if (!gameOver) {
      // Place piece on board
      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = currentPlayer;
          break;
        }
      }

      // Check status of board
      let result = checkAll(board);
      if (result === player1) {
        setBoard(board)
        setGameOver(true)
        setMessage('Player 1 (red) wins!')
      } else if (result === player2) {
        setBoard(board)
        setGameOver(true)
        setMessage('Player 2 (yellow) wins!')
      } else if (result === 'draw') {
        setBoard(board)
        setGameOver(true)
        setMessage('Draw!')
      } else {
        setBoard(board)
        setCurrentPlayer(togglePlayer())
      }
    } else {
      setMessage('Game over, start again')
    }
  }

  function checkVertical(board) {
    // Check only if row is 3 or greater
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c] &&
              board[r][c] === board[r - 2][c] &&
              board[r][c] === board[r - 3][c]) {
            return board[r][c];
          }
        }
      }
    }
  }

  function checkHorizontal(board) {
    // Check only if column is 3 or less
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r][c + 1] &&
              board[r][c] === board[r][c + 2] &&
              board[r][c] === board[r][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  function checkDiagonalRight(board) {
    // Check only if row is 3 or greater AND column is 3 or less
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c + 1] &&
              board[r][c] === board[r - 2][c + 2] &&
              board[r][c] === board[r - 3][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  function checkDiagonalLeft(board) {
    // Check only if row is 3 or greater AND column is 3 or greater
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c - 1] &&
              board[r][c] === board[r - 2][c - 2] &&
              board[r][c] === board[r - 3][c - 3]) {
            return board[r][c];
          }
        }
      }
    }
  }

  function checkDraw(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === null) {
          return null;
        }
      }
    }
    return 'draw';
  }

  function checkAll(board) {
    return checkVertical(board) || checkDiagonalRight(board) || checkDiagonalLeft(board) || checkHorizontal(board) || checkDraw(board);
  }

  return (
    <SafeAreaView style={styles.container}>
        <Button title="New Game" onPress={() => { initBoard() }}></Button>

        <View style={styles.gameContainer}>
          {board.map((row, i) => (<Row key={i} row={row} play={ play } />))}
        </View>

        <Text style={styles.message}>{message}</Text>
        <StatusBar style="auto"></StatusBar>
    </SafeAreaView>
  )
}

function Row({ row, play }) {
  return (
      <View style={styles.row}>
        {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={play} />)}
      </View>
  )
}

function Cell({ value, columnIndex, play }) {
  let color = styles.white
  if (value === 1) {
    color = styles.red
  } else if (value === 2) {
    color = styles.yellow
  }

  return (
      <Pressable style={styles.cell} onPress={() => {play(columnIndex)}}>
        <View style={color}></View>
      </Pressable>
  )
}

const styles = StyleSheet.create({
  mb4:{
    marginBottom: 20,
  },
  row: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "center"
  },
  gameContainer: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  message: {
    textAlign: 'center',
    fontSize: 17
  },
  white: {
    height: 30,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 100,
    transition: 'background-color 0.5s'
  },
  red: {
    height: 30,
    width: 30,
    backgroundColor: 'red',
    borderRadius: 100,
    transition: 'background-color 0.5s'
  },
  yellow: {
    height: 30,
    width: 30,
    backgroundColor: 'yellow',
    borderRadius: 100,
    transition: 'background-color 0.5s'
  },
  cell: {
    height: 40,
    width: 40,
    backgroundColor: '#1990ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
