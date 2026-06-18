import React, { useEffect, useMemo, useState } from "react";
import {
    faCreditCard,
    faMoneyBillWave,
    faTicket,
    faTrash,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Ticket.module.css";

const PAYMENT_METHODS = [
    { key: "card", label: "Carte", icon: faCreditCard },
    { key: "cash", label: "Espèces", icon: faMoneyBillWave },
    { key: "restaurantTicket", label: "Ticket restaurant", icon: faTicket },
    { key: "restaurantTicketCard", label: "Carte ticket restaurant", icon: faCreditCard },
];

const toCents = (amount) => Math.round(Number(amount || 0) * 100);
const fromCents = (amount) => amount / 100;
const formatPrice = (amount) => `${amount.toFixed(2)} €`;
const parseAmount = (amount) => Number(String(amount).replace(",", "."));

const Ticket = ({ selectedAliments, total, onAlimentRemove, onPlaceInSummary }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payments, setPayments] = useState([]);

  const totalCents = toCents(total);
  const paidCents = useMemo(
    () => payments.reduce((sum, payment) => sum + toCents(payment.amount), 0),
    [payments]
  );
  const remainingCents = Math.max(totalCents - paidCents, 0);
  const remaining = fromCents(remainingCents);
  const hasPayments = payments.length > 0;
  const canAddPayment = selectedAliments.length > 0 && remainingCents > 0;
  const canFinishTicket = selectedAliments.length > 0 && totalCents > 0 && remainingCents === 0;

  useEffect(() => {
    if (selectedAliments.length === 0 || totalCents === 0) {
      setPayments([]);
      setPaymentAmount("");
    }
  }, [selectedAliments.length, totalCents]);

  const handleAddPayment = () => {
    if (!canAddPayment) return;

    const parsedAmount = parseAmount(paymentAmount);
    if (paymentAmount !== "" && Number.isNaN(parsedAmount)) return;

    const amountCents = paymentAmount === "" ? remainingCents : toCents(parsedAmount);
    if (amountCents <= 0) return;

    const appliedCents = Math.min(amountCents, remainingCents);
    const method = PAYMENT_METHODS.find((item) => item.key === paymentMethod);

    setPayments((prev) => [
      ...prev,
      {
        method: paymentMethod,
        label: method?.label || paymentMethod,
        amount: fromCents(appliedCents),
      },
    ]);
    setPaymentAmount("");
  };

  const handleFinishTicket = () => {
    if (!canFinishTicket) return;
    onPlaceInSummary(payments);
    setPayments([]);
    setPaymentAmount("");
    setPaymentMethod("card");
  };

  const handleResetPayments = () => {
    setPayments([]);
    setPaymentAmount("");
  };

  const handlePaymentAmountChange = (event) => {
    const value = event.target.value;
    if (/^(\d+([,.]\d{0,2})?|[,.]\d{1,2})?$/.test(value)) {
      setPaymentAmount(value);
    }
  };

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
                        disabled={hasPayments}
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
            <span className={styles.ticketTotalAmount}>{formatPrice(total)}</span>
        </div>
        <div className={styles.paymentPanel}>
            <div className={styles.paymentMethods} role="group" aria-label="Mode de paiement">
                {PAYMENT_METHODS.map((method) => (
                    <button
                        key={method.key}
                        type="button"
                        className={`${styles.paymentMethodButton} ${
                            paymentMethod === method.key ? styles.paymentMethodButtonActive : ""
                        }`}
                        onClick={() => setPaymentMethod(method.key)}
                        disabled={!canAddPayment}
                        title={method.label}
                    >
                        <FontAwesomeIcon icon={method.icon} />
                        <span>{method.label}</span>
                    </button>
                ))}
            </div>
            <div className={styles.paymentEntry}>
                <input
                    className={styles.paymentInput}
                    type="text"
                    inputMode="decimal"
                    placeholder={formatPrice(remaining)}
                    value={paymentAmount}
                    onChange={handlePaymentAmountChange}
                    disabled={!canAddPayment}
                />
                <button
                    type="button"
                    className={styles.addPaymentButton}
                    onClick={handleAddPayment}
                    disabled={!canAddPayment}
                >
                    Ajouter
                </button>
            </div>
            {payments.length > 0 && (
                <div className={styles.paymentList}>
                    {payments.map((payment, index) => (
                        <div key={`${payment.method}-${index}`} className={styles.paymentLine}>
                            <span>{payment.label}</span>
                            <span>{formatPrice(payment.amount)}</span>
                        </div>
                    ))}
                    <button
                        type="button"
                        className={styles.resetPaymentsButton}
                        onClick={handleResetPayments}
                    >
                        <FontAwesomeIcon icon={faUndo} />
                        <span>Annuler les paiements</span>
                    </button>
                </div>
            )}
            <div className={styles.remainingRow}>
                <span>Reste à payer</span>
                <span>{formatPrice(remaining)}</span>
            </div>
        </div>
        <button 
            className={styles.validateButton} 
            onClick={handleFinishTicket}
            disabled={!canFinishTicket}
        >
          Terminer le ticket
        </button>
      </div>
    </div>
  );
};

export default Ticket;
