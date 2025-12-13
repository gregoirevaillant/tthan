import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Ticket.module.css";

const Ticket = ({ selectedAliments, total, onAlimentRemove, onPlaceInSummary }) => {
  return (
    <div className={styles.ticketContainer}>
      {/* Header */}
      <div className={styles.ticketHeader}>
        <h3>Commande en cours</h3>
        <span className={styles.itemCount}>
            {selectedAliments.length} article{selectedAliments.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Scrollable List */}
      <div className={styles.ticketBody}>
        {selectedAliments.length === 0 ? (
            <div className={styles.emptyTicket}>
                <p>Sélectionnez un plat</p>
            </div>
        ) : (
            <ul className={styles.ticketList}>
            {selectedAliments.map((aliment) => (
                <li key={aliment.id} className={styles.ticketItem}>
                    <div className={styles.ticketItemInfo}>
                        <span className={styles.ticketItemName}>{aliment.name}</span>
                        <span className={styles.ticketItemPrice}>{aliment.price.toFixed(2)} €</span>
                    </div>
                    <button
                        className={styles.deleteButton}
                        onClick={() => onAlimentRemove(aliment.id)}
                        title="Supprimer"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </li>
            ))}
            </ul>
        )}
      </div>

      {/* Sticky Footer */}
      <div className={styles.ticketFooter}>
        <div className={styles.ticketTotalRow}>
            <span>Total à payer</span>
            <span className={styles.ticketTotalAmount}>{total.toFixed(2)} €</span>
        </div>
        <button 
            className={styles.validateButton} 
            onClick={onPlaceInSummary}
            disabled={selectedAliments.length === 0}
        >
          Encaisser
        </button>
      </div>
    </div>
  );
};

export default Ticket;