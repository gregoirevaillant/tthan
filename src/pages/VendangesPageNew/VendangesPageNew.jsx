import React, { useState } from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import styles from "./VendangesPageNew.module.css";

function VendangesPageNew() {
    const initialMenuItems = [
        { id: 1, name: "Bánh mì", quantity: 0, price: 7.0 },
        { id: 2, name: "Nems poulet", quantity: 0, price: 5 },
        { id: 3, name: "Samoussa légumes", quantity: 0, price: 5 },
        { id: 4, name: "Bún bò", quantity: 0, price: 12.5 },
        { id: 5, name: "Bún bò + nems", quantity: 0, price: 14 },
        { id: 6, name: "Wok nouilles", quantity: 0, price: 11 },
        { id: 7, name: "Fruits", quantity: 0, price: 2.5 },
        { id: 8, name: "Tapioca", quantity: 0, price: 3.5 },
        { id: 9, name: "Gaufre sucre", quantity: 0, price: 2.5 },
        { id: 10, name: "Gaufre choco / cara", quantity: 0, price: 3.5 },
    ];

    const [menuItems, setMenuItems] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("menuItems"));
        return stored || initialMenuItems;
    });

    const [currentOrder, setCurrentOrder] = useState([]);

    const [orderCount, setOrderCount] = useState(() => {
        return parseInt(localStorage.getItem("orderCount")) || 0;
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
            .map((o) =>
                o.id === id ? { ...o, quantity: o.quantity - 1 } : o
            )
            .filter((o) => o.quantity > 0);
        setCurrentOrder(updatedOrder);
    };

    const resetMenu = () => {
        setMenuItems(initialMenuItems);
        localStorage.setItem("menuItems", JSON.stringify(initialMenuItems));
        setOrderCount(0);
        localStorage.setItem("orderCount", "0");
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

    const submitOrder = () => {
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

        setCurrentOrder([]);
    };

    const orderTotal = currentOrder.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.menuSection}>
                {menuItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`${styles.menuCard} ${
                            styles["div" + (index + 1)]
                        }`}
                        onClick={() => handleAddItem(item)}
                    >
                        <span className={styles.menuName}>{item.name}</span>
                        <span className={styles.menuPrice}>
                            {item.price.toFixed(2)} €
                        </span>
                    </div>
                ))}

                <div className={`${styles.command} ${styles.div11}`}>
                    <h3>Commande</h3>
                    <div className={styles.orderList}>
                        {currentOrder.length === 0 ? (
                            <p>Aucun article</p>
                        ) : (
                            currentOrder.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.orderItem}
                                >
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <button
                                    className={styles.removeBtn}
                                        onClick={() =>
                                            handleRemoveFromOrder(item.id)
                                        }
                                    >
                                        -
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className={styles.orderFooter}>
                        <b>Total: {orderTotal.toFixed(2)} €</b>
                        <button
                            className={styles.submitBtn}
                            onClick={submitOrder}
                            disabled={currentOrder.length === 0}
                        >
                            Valider
                        </button>
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
                    <h3>Nombre de commandes: <b>{orderCount}</b></h3>
                </div>

                <div className={styles.resetWrapper}>
                    <button className={styles.resetButton} onClick={resetConfirmation}>Réinitialiser</button>
                </div>
            </div>
        </div>
    );
}

export default VendangesPageNew;
