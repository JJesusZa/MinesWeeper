import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';

//aqui se maneja el boardData para  poner los valores de cada cuadrito.

export default class Board extends React.Component {
  state = {
    boardData: this.initBoardData(
      this.props.height,
      this.props.width,
      this.props.mines
    ),
    gameStatus: 'ONNNNNNNNNNNNNN :) ',
    mineCount: this.props.mines,
  };

  // obtener minas
  getMines(data) {
    let mineArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
        if (dataitem.isMine) {
          mineArray.push(dataitem);
        }
        return mineArray;
      });
      return mineArray;
    });

    return mineArray;
  }

  // obtener banderitas
  getFlags(data) {
    let mineArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
        if (dataitem.isFlagged) {
          mineArray.push(dataitem);
        }
        return mineArray;
      });
      return mineArray;
    });

    return mineArray;
  }

  // celdas vacias
  getHidden(data) {
    let mineArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
        if (!dataitem.isRevealed) {
          mineArray.push(dataitem);
        }
        return mineArray;
      });
      return mineArray;
    });

    return mineArray;
  }

  // llenar la tabla de numero aleatorios
  getRandomNumber(dimension) {
    return Math.floor(Math.random() * 1000 + 1) % dimension;
  }

  // iniciar la tabla con datos
  initBoardData(height, width, mines) {
    let data = this.createEmptyArray(height, width);
    data = this.plantMines(data, height, width, mines);
    data = this.getNeighbours(data, height, width);
    return data;
  }

  createEmptyArray(height, width) {
    let data = [];

    for (let i = 0; i < height; i++) {
      data.push([]);
      for (let j = 0; j < width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  // plantar minas eleatoriamente en el tablero
  plantMines(data, height, width, mines) {
    let randomx,
      randomy,
      minesPlanted = 0;

    while (minesPlanted < mines) {
      randomx = this.getRandomNumber(width);
      randomy = this.getRandomNumber(height);
      if (!data[randomx][randomy].isMine) {
        data[randomx][randomy].isMine = true;
        minesPlanted++;
      }
    }

    return data;
  }

  // numero de celdas vacinas para cada celda que no es mina y actualiza con el numero
  //de minas alrededor
  getNeighbours(data, height, width) {
    let updatedData = data,
      // eslint-disable-next-line no-unused-vars
      index = 0;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (data[i][j].isMine !== true) {
          let mine = 0;
          const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
          area.map((value) => {
            if (value.isMine) {
              mine++;
            }
            return mine;
          });
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbour = mine;
        }
      }
    }

    return updatedData;
  }

  // busca celdas vecinas y las devuelve
  traverseBoard(x, y, data) {
    const el = [];

    //up
    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    //down
    if (x < this.props.height - 1) {
      el.push(data[x + 1][y]);
    }

    //left
    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    //right
    if (y < this.props.width - 1) {
      el.push(data[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < this.props.width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if (x < this.props.height - 1 && y < this.props.width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if (x < this.props.height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  }

  // revelar tablero
  revealBoard() {
    let updatedData = this.state.boardData;
    updatedData.map((datarow) => {
      datarow.map((dataitem) => {
        dataitem.isRevealed = true;
        return updatedData;
      });
      return updatedData;
    });
    this.setState({
      boardData: updatedData,
    });
  }

  /* revelar la celdas vacias */
  revealEmpty(x, y, data) {
    let area = this.traverseBoard(x, y, data);
    area.map((value) => {
      if (
        !value.isFlagged &&
        !value.isRevealed &&
        (value.isEmpty || !value.isMine)
      ) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          this.revealEmpty(value.x, value.y, data);
        }
      }
      return data;
    });
    return data;
  }

  // Eventos del click

  handleCellClick(x, y) {
    // si está revelado. regresa true.
    if (
      this.state.boardData[x][y].isRevealed ||
      this.state.boardData[x][y].isFlagged
    )
      return null;

    // si es mina. game over true
    if (this.state.boardData[x][y].isMine) {
      this.setState({ gameStatus: 'Ups creo Perdiste (:' });
      this.revealBoard();
      alert('Juego terminado');
    }

    let updatedData = this.state.boardData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = this.revealEmpty(x, y, updatedData);
    }

    if (this.getHidden(updatedData).length === this.props.mines) {
      this.setState({ mineCount: 0, gameStatus: 'Ganaste (::) we. y' });
      this.revealBoard();
      alert('Ganaste (::) we y');
    }

    this.setState({
      boardData: updatedData,
      mineCount: this.props.mines - this.getFlags(updatedData).length,
    });
  }
  //poner banderita si no esta marcada  y si esta marcada la desmarca
  handleContextMenu(e, x, y) {
    e.preventDefault();
    let updatedData = this.state.boardData;
    let mines = this.state.mineCount;

    // si está revelado
    if (updatedData[x][y].isRevealed) return;

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }

    if (mines === 0) {
      const mineArray = this.getMines(updatedData);
      const FlagArray = this.getFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
        this.setState({ mineCount: 0, gameStatus: 'Ganaste Prro.' });
        this.revealBoard();
        alert('Ganaste Prro');
      }
    }

    this.setState({
      boardData: updatedData,
    });
  }

  renderBoard(data) {
    return data.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
              cMenu={(e) => this.handleContextMenu(e, dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className='limpiar' />
            ) : (
              ''
            )}
          </div>
        );
      });
    });
  }

  render() {
    return (
      <div className='board'>
        <div className='game-info'>
          {/* <span className='info'>Minas restantes: {this.state.mineCount}</span> */}
          <h1 className='info'>{this.state.gameStatus}</h1>
        </div>
        {this.renderBoard(this.state.boardData)}
      </div>
    );
  }
}

Board.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  mines: PropTypes.number,
};
