import React, { useMemo, useState } from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCreditCard,
    faMoneyBillWave,
    faTicket,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import styles from "./VendangesPageNew.module.css";

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

function VendangesPageNew() {
    const initialMenuItems = [
        { id: 1, name: "Bánh mì", quantity: 0, price: 7 },
        { id: 2, name: "Nems poulet", quantity: 0, price: 5 },
        { id: 3, name: "Samoussa légumes", quantity: 0, price: 5 },
        { id: 4, name: "Bún bò", quantity: 0, price: 13 },
        { id: 5, name: "Bún bò + nems", quantity: 0, price: 14.5 },
        { id: 6, name: "Wok nouilles", quantity: 0, price: 12 },
        { id: 7, name: "Fruits", quantity: 0, price: 2.5 },
        { id: 8, name: "Tapioca", quantity: 0, price: 3.5 },
        { id: 9, name: "Crêpe sucre", quantity: 0, price: 2.5 },
        { id: 10, name: "Crêpe choco", quantity: 0, price: 3.5 },
    ];

    const [currentOrder, setCurrentOrder] = useState([]);
    const [orderCount, setOrderCount] = useState(() => {
        return parseInt(localStorage.getItem("orderCount")) || 0;
    });
    const [menuItems, setMenuItems] = useState(() => {
        try {
            const stored = localStorage.getItem("menuItems");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("Invalid menuItems in localStorage, resetting.", e);
        }
        return initialMenuItems;
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [payments, setPayments] = useState([]);
    const [vendangesPayments, setVendangesPayments] = useState(() => {
        try {
            const stored = localStorage.getItem("vendangesPayments");
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.warn("Invalid vendangesPayments in localStorage, resetting.", e);
            return {};
        }
    });

    const handleAddItem = (item) => {
        const updatedOrder = [...currentOrder];
        const existing = updatedOrder.find((o) => o.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            updatedOrder.push({ ...item, quantity: 1 });
        }
        setCurrentOrder(updatedOrder);
    };

    const handleRemoveFromOrder = (id) => {
        const updatedOrder = currentOrder
            .map((o) => (o.id === id ? { ...o, quantity: o.quantity - 1 } : o))
            .filter((o) => o.quantity > 0);
        setCurrentOrder(updatedOrder);
    };

    const resetMenu = () => {
        setMenuItems(initialMenuItems);
        localStorage.setItem("menuItems", JSON.stringify(initialMenuItems));
        setOrderCount(0);
        localStorage.setItem("orderCount", "0");
        setVendangesPayments({});
        localStorage.removeItem("vendangesPayments");
    };

    const resetConfirmation = () => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir réinitialiser les statistiques ?"
            )
        ) {
            resetMenu();
        }
    };

    const submitOrder = (orderPayments = []) => {
        if (currentOrder.length === 0) return;

        const updated = menuItems.map((m) => {
            const orderedItem = currentOrder.find((o) => o.id === m.id);
            if (orderedItem) {
                return { ...m, quantity: m.quantity + orderedItem.quantity };
            }
            return m;
        });

        setMenuItems(updated);
        localStorage.setItem("menuItems", JSON.stringify(updated));

        const newCount = orderCount + 1;
        setOrderCount(newCount);
        localStorage.setItem("orderCount", newCount.toString());

        setVendangesPayments((prev) => {
            const updatedPayments = orderPayments.reduce((acc, payment) => {
                const currentAmount = acc[payment.label] || 0;
                acc[payment.label] = currentAmount + payment.amount;
                return acc;
            }, { ...prev });
            localStorage.setItem("vendangesPayments", JSON.stringify(updatedPayments));
            return updatedPayments;
        });

        setCurrentOrder([]);
    };

    const orderTotal = currentOrder.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    const totalCents = toCents(orderTotal);
    const paidCents = useMemo(
        () => payments.reduce((sum, payment) => sum + toCents(payment.amount), 0),
        [payments]
    );
    const remainingCents = Math.max(totalCents - paidCents, 0);
    const remaining = fromCents(remainingCents);
    const canAddPayment = currentOrder.length > 0 && remainingCents > 0;

    const parsedEnteredAmount = paymentAmount === "" ? null : parseAmount(paymentAmount);
    const enteredAmountInvalid = paymentAmount !== "" && Number.isNaN(parsedEnteredAmount);
    const enteredCents = paymentAmount === "" ? remainingCents : toCents(parsedEnteredAmount || 0);
    // When the entered amount covers what's left, this payment settles the order immediately.
    const willSettleOrder = canAddPayment && !enteredAmountInvalid && enteredCents >= remainingCents;

    const handleAddPayment = () => {
        if (!canAddPayment || enteredAmountInvalid || enteredCents <= 0) return;

        const appliedCents = Math.min(enteredCents, remainingCents);
        const method = PAYMENT_METHODS.find((item) => item.key === paymentMethod);
        const newPayment = {
            method: paymentMethod,
            label: method?.label || paymentMethod,
            amount: fromCents(appliedCents),
        };

        if (appliedCents >= remainingCents) {
            // Fully paid: settle straight away, no separate confirmation step.
            submitOrder([...payments, newPayment]);
            setPayments([]);
            setPaymentAmount("");
            setPaymentMethod("card");
        } else {
            setPayments((prev) => [...prev, newPayment]);
            setPaymentAmount("");
        }
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

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.workspace}>
                <div className={styles.menuGrid}>
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={styles.menuCard}
                            onClick={() => handleAddItem(item)}
                        >
                            <span className={styles.menuName}>{item.name}</span>
                            <span className={styles.menuPrice}>
                                {item.price.toFixed(2)} €
                            </span>
                        </div>
                    ))}
                </div>

                <div className={styles.commandPanel}>
                    <h3>Commande</h3>
                    <div className={styles.orderList}>
                        {currentOrder.length === 0 ? (
                            <p>Aucun article</p>
                        ) : (
                            currentOrder.map((item) => (
                                <div key={item.id} className={styles.orderItem}>
                                    <div className={styles.orderItemInfo}>
                                        <span className={styles.orderItemName}>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className={styles.orderItemUnitPrice}>
                                            {item.price.toFixed(2)} € / unité
                                        </span>
                                    </div>
                                    <div className={styles.orderItemRight}>
                                        <span className={styles.orderItemTotal}>
                                            {(item.price * item.quantity).toFixed(2)} €
                                        </span>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() =>
                                                handleRemoveFromOrder(item.id)
                                            }
                                            disabled={payments.length > 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
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
                                    <Icon icon={method.icon} />
                                    <span>{method.label}</span>
                                </button>
                            ))}
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
                                    <Icon icon={faUndo} />
                                    <span>Annuler les paiements</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.orderFooter}>
                        <div className={styles.orderTotals}>
                            <b>Total: {orderTotal.toFixed(2)} €</b>
                            {payments.length > 0 && (
                                <span className={styles.remainingHint}>Reste à payer: {formatPrice(remaining)}</span>
                            )}
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
                                className={styles.submitBtn}
                                onClick={handleAddPayment}
                                disabled={!canAddPayment}
                            >
                                {willSettleOrder ? "Valider" : "Ajouter"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.stats}>
                <button
                    className={styles.back}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <Icon icon={faArrowLeft} />
                </button>
                <h2 className={styles.tableTitle}>Statistiques</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Plat</th>
                            <th>Quantité</th>
                            <th>Total (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    {(item.quantity * item.price).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.totalWrapper}>
                    <h2>
                        Total Revenus:{" "}
                        <b>
                            {menuItems
                                .reduce(
                                    (acc, item) =>
                                        acc + item.quantity * item.price,
                                    0
                                )
                                .toFixed(2)}
                        </b>{" "}
                        €
                    </h2>
                    <h3>
                        Nombre de commandes: <b>{orderCount}</b>
                    </h3>
                </div>

                {Object.keys(vendangesPayments).length > 0 && (
                    <div className={styles.encaissements}>
                        <h4>Encaissements</h4>
                        <div className={styles.encaissementsGrid}>
                            {Object.entries(vendangesPayments).map(([label, amount]) => (
                                <div key={label} className={styles.encaissementItem}>
                                    <span>{label}</span>
                                    <strong>{amount.toFixed(2)} €</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.resetWrapper}>
                    <button
                        className={styles.resetButton}
                        onClick={resetConfirmation}
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VendangesPageNew;
