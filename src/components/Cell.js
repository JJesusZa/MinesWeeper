import React from 'react';
import PropTypes from 'prop-types';

//renderizamos cada cuadrado y con el getvalue() asignamos su valor

export default class Cell extends React.Component {
    getValue() {
        const { value } = this.props;
        //si la celda no se revela devolvemos nulo
        if (!value.isRevealed) {
            return this.props.value.isFlagged ? "🚩" : null;
            //si la celda no se revela pero la marcamos con el click derecho le ponemos una bandera
        }
        if (value.isMine) {
            return "💣";
            //si la celda se revela y es mina, devoolvemos una bombita
        }
        if (value.neighbour === 0) {
            return null;
            //si la celda se revela y no tiene minas al rededor devolvemos nulo
        }
        return value.neighbour;
    }

    render() {
        const { value, onClick, cMenu } = this.props;
        let className =
            "cell" +
            (value.isRevealed ? "" : " oculta") +
            (value.isMine ? " es-mina" : "") +
            (value.isFlagged ? " es-bandera" : "");

        return (
            <div
                onClick={onClick}
                className={className}
                onContextMenu={cMenu}
            >
                {this.getValue()}
            </div>
        );
    }
}
//comprobacion de tipos con propTypes
const cellItemShape = {
    isRevealed: PropTypes.bool,
    isMine: PropTypes.bool,
    isFlagged: PropTypes.bool
}

Cell.propTypes = {
    value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
    onClick: PropTypes.func,
    cMenu: PropTypes.func
}
