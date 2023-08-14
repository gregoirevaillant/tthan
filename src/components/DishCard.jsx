import "./DishCard.css";

function DishCard(props) {
    const plat = props.plat;

    return (
        <div key={plat.id} className="dish-wrapper">
            <div>
                <span className="dish-name">
                    {plat.nom} - {plat.prix} €
                </span>
                <span className="dish-quantity">{plat.quantite}</span>
            </div>
            <div className="button-wrapper">
                <button
                    className="button primary"
                    onClick={() => {
                        props.onIncrement(plat);
                    }}
                >
                    +1
                </button>
                <button
                    className="button secondary"
                    onClick={() => {
                        props.onDecrement(plat);
                    }}
                >
                    -1
                </button>
            </div>
        </div>
    );
}

export default DishCard;
