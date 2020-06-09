import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

const headingStyle = {
  fontSize: '2rem',
  fontFamily: 'helvetica',
  letterSpacing: '-0.85px',
  color: '#1a1a1a',
}

const pStyle = {
  fontFamily: 'helvetica',
  color: '#444444',
  marginBottom: '1.5rem',
}

const buttonStyle = {
  fontFamily: 'helvetica',
  padding: '0.5rem 1rem',
  marginBottom: '0.5rem',
  marginRight: '0.25rem',
  cursor: 'pointer',
  background: '#1a1a1a',
  color: '#ffffff',
  border: 'none',
  fontSize: '1.2rem',
}

const numRows = 50;
const numCols = 60;

const operations = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const emptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i += 1) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
}

const App = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i += 1) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef();
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((grid) => {
      return produce(grid, gridCopy => {
        for (let i = 0; i < numRows; i += 1) {
          for (let j = 0; j < numCols; j += 1) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += grid[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (grid[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });


    setTimeout(runSimulation, 0);
  }, []);

  return (
    <>
      <h1 style={headingStyle}>Click on a cell to change its state</h1>
      <p style={pStyle}>Continue clicking on the cells, even while the simulation is going.</p>
      <button style={buttonStyle} onClick={() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}>{running ? 'stop' : 'start'}</button>
      <button style={buttonStyle} onClick={() => {
        setGrid(emptyGrid);
      }}>Clear</button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, j) =>
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20, height: 20,
                background: grid[i][j] ? '#C6FACC' : undefined,
                border: 'solid 1px rgba(0, 0, 0, 0.1)',
                cursor: 'crosshair'
              }}>
            </div>
          ))
        }
      </div >
    </>
  )
}

export default App;
