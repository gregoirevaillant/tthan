import React from "react";
import styles from "./DailyPage.module.css";

const Ticket = ({ selectedAliments, total, onAlimentRemove, onPlaceInSummary }) => {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketHeader}>
        <h2>Ticket : {total} €</h2>
        <button className={styles.ticketButton} onClick={onPlaceInSummary}>
          Valider
        </button>
      </div>
      <div>
        <ul className={styles.ticketList}>
          {selectedAliments.map((aliment, index) => (
            <li key={index} className={styles.ticketItem}>
              <span>
                <b>{aliment.name}</b> - {aliment.price} €
              </span>
              <button
                className={styles.ticketButton}
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
