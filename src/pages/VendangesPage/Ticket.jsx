import styles from './Ticket.module.css';

const Ticket = ({
    selectedAliments,
    total,
    onAlimentRemove,
    onPlaceInSummary,
}) => {
    return (
        <div className={styles.ticket}>
            <div className={styles["ticket-header"]}>
                <h2>Ticket : {total} €</h2>
                <button className={styles['ticket-button']} onClick={onPlaceInSummary}>
                    Valider
                </button>
            </div>
            <div>
                <ul className={styles["ticket-list"]}>
                    {selectedAliments.map((aliment, index) => (
                        <li key={index} className={styles["ticket-item"]} id={index}>
                            <span>
                                <b>{aliment.name}</b> - {aliment.price} €
                            </span>
                            <button
                                className={styles["ticket-button"]}
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
