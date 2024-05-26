import {
    Stack,
  } from "@mui/material";
  import { useState, useMemo, useCallback, useEffect, useContext } from "react";
  import { Chessboard } from "react-chessboard";
  import { Chess }  from "chess.js";
  import CustomDialog from "./components/CustomDialog";
  import classes from "./Chess.module.css";
  import { getAvailableSquares, isInCheck } from "./utils/utilityFunctions";
  import { calculateBestMove } from "./AI/minimax";

  function Game({orientation}) {
    const [chess, setChess ] = useState(new Chess());
    const [fen, setFen] = useState(chess.fen()); // <- 2
    const [over, setOver] = useState("");  
    const [inCheck, setInCheck] = useState({ element: null, value: false });
    const [ difficulty, setDifficulty ] = useState(1);
    const [currentTimeout, setCurrentTimeout] = useState(undefined);
    
    function unhighlightAvailableMoves(piece, sourceSquare) {
        const squares = getAvailableSquares(chess, sourceSquare);
    
        squares.forEach((square) => {
          square.classList.remove(classes.highlight);
        });
      }

      function highlightAvailableMoves(piece, sourceSquare) {
        const squares = getAvailableSquares(chess, sourceSquare);
    
        squares.forEach((square) => {
          square.classList.add(classes.highlight);
        });
      }


    const makeAiMove = () => {
        const bestMove = calculateBestMove(chess, difficulty);
        
        if (chess.isGameOver() || chess.isDraw()) {
          return;
        }
        chess.move(bestMove);
        
       

        isInCheck(chess, inCheck, setInCheck, classes);
        setFen(chess.fen()); // update fen state to trigger a re-render
        console.log('inCheck',inCheck)
        
      };
    useEffect(() => {
        if (inCheck.element !== null) {
          if (inCheck.value) {
            inCheck.element.classList.add(classes.inCheck);
          } else {
            inCheck.element.classList.remove(classes.inCheck);
          }
        }
      }, [inCheck.value]);
    // onDrop function
    function onDrop(sourceSquare, targetSquare) {
      // unhighlight the board square after a move
        unhighlightAvailableMoves(null, sourceSquare);
        try{
            chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
    
        
            // if there is a check
            isInCheck(chess, inCheck, setInCheck, classes);
            setFen(chess.fen()); // update fen state to trigger a re-render
    
            const newTimeout = setTimeout(makeAiMove, 100);
            setCurrentTimeout(newTimeout);
            return true;
        }catch{
           
            
        }
        
    }
  
    
  
    // Game component returned jsx
    return (
      <Stack>
        <Stack flexDirection="row" sx={{ pt: 2 }}>
          <div className="board" style={{
            maxWidth: 600,
            maxHeight: 600,
            flexGrow: 1,
          }}>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={orientation}
              onPieceDragEnd={unhighlightAvailableMoves}
              onPieceDragBegin={highlightAvailableMoves}
            />
          </div>
        </Stack>
        <CustomDialog // Game Over CustomDialog
          open={Boolean(over)}
          title={over}
          contentText={over}
        />
      </Stack>
    );
  }
  
  export default Game;