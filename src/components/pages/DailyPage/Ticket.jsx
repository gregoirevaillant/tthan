const Ticket = ({
    selectedAliments,
    total,
    onAlimentRemove,
    onPlaceInSummary,
}) => {
    return (
        <div className="ticket">
            <div className="ticket-header">
                <h2>Ticket : {total} €</h2>
                <button className="button" onClick={onPlaceInSummary}>
                    Valider
                </button>
            </div>
            <div>
                <ul className="ticket-list">
                    {selectedAliments.map((aliment, index) => (
                        <li key={index} className="ticket-item" id={index}>
                            <span>
                                <b>{aliment.name}</b> - {aliment.price} €
                            </span>
                            <button
                                className="ticket-button"
                                onClick={() => onAlimentRemove(aliment.id)}
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Ticket;
