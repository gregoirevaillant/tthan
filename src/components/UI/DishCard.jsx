import "./DishCard.css";

function DishCard(props) {
    return (
        <div key={props.plat.id} className="card-wrapper">
            <span className="dish-name">
                {props.plat.nom} - {props.plat.prix} €
            </span>
            <span className="dish-quantity">{props.plat.quantite}</span>
            <div className="button-wrapper">
                <button
                    className="button primary"
                    onClick={() => {
                        props.onIncrement(props.plat);
                    }}
                >
                    +1
                </button>
                <button
                    className="button secondary"
                    onClick={() => {
                        props.onDecrement(props.plat);
                    }}
                >
                    -1
                </button>
            </div>
        </div>
    );
}

export default DishCard;
