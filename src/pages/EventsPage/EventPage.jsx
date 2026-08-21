import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCalendarAlt,
    faFileInvoiceDollar,
    faGripLines,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Aliments from "./Aliments";
import Ticket from "./Ticket";
import styles from "./EventPage.module.css";

const DraggableMenuItem = ({ item, index, moveItem, removeItem }) => {
    const [, ref] = useDrag({
        type: "MENU_ITEM",
        item: { index },
    });

    const [, drop] = useDrop({
        accept: "MENU_ITEM",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <li ref={(node) => ref(drop(node))} className={styles.menuEditItem}>
            <div className={styles.menuEditItemInfo}>
                <FontAwesomeIcon icon={faGripLines} className={styles.dragIcon} />
                <span className={styles.menuEditItemName}>{item.name}</span>
                <span className={styles.menuEditItemPrice}>
                    {Number(item.price).toFixed(2)} €
                </span>
            </div>
            <button
                className={styles.removeItemButton}
                onClick={() => removeItem(item.id)}
                title="Supprimer"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </li>
    );
};

function EventPage() {
    const [selectedAliments, setSelectedAliments] = useState([]);
    const [total, setTotal] = useState(0);
    const [orderSummary, setOrderSummary] = useState([]);
    const [allOrders, setAllOrders] = useState({});
    const [eventStarted, setEventStarted] = useState(false);
    const [eventItems, setEventItems] = useState([]);
    const [eventOrderCount, setEventOrderCount] = useState(0);
    const [eventPayments, setEventPayments] = useState({});

    const [newMenuItem, setNewMenuItem] = useState({
        name: "",
        price: "",
    });

    const navigate = useNavigate();

    const handleAddMenuItem = () => {
        if (!newMenuItem.name || newMenuItem.price === "") return;
        setEventItems((prevItems) => [
            ...prevItems,
            { name: newMenuItem.name, price: parseFloat(newMenuItem.price), id: Date.now().toString() },
        ]);
        setNewMenuItem({ name: "", price: "" });
    };

    const handleRemoveMenuItem = (itemId) => {
        setEventItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
        );
    };

    const handleStartDay = () => {
        localStorage.setItem("eventStarted", true);
        setEventStarted(true);
    };

    const handleEndDay = () => {
        const confirmEndDay = window.confirm(
            `Etes vous sur de vouloir terminer le service ?\n\nLe résumé du jour sera supprimé.`
        );
        if (confirmEndDay) {
            localStorage.removeItem("eventStarted");
            localStorage.removeItem("eventSummary");
            localStorage.removeItem("eventOrderCount");
            localStorage.removeItem("eventPayments");
            setEventOrderCount(0);
            setEventPayments({});
            setOrderSummary([]);
            setAllOrders({});
            setEventStarted(false);
        }
    };

    useEffect(() => {
        const storedSummary = localStorage.getItem("eventSummary");
        if (storedSummary) {
            const parsedSummary = JSON.parse(storedSummary);
            setOrderSummary(parsedSummary);
            setAllOrders(
                parsedSummary.reduce((acc, aliment) => {
                    acc[aliment.name] = { ...aliment };
                    return acc;
                }, {})
            );
        }

        const storedEventOrderCount = localStorage.getItem("eventOrderCount");
        if (storedEventOrderCount) {
            setEventOrderCount(parseInt(storedEventOrderCount, 10));
        }

        const storedEventPayments = localStorage.getItem("eventPayments");
        if (storedEventPayments) {
            setEventPayments(JSON.parse(storedEventPayments));
        }

        const storedEventItems = localStorage.getItem("eventItems");
        if (storedEventItems) {
            setEventItems(JSON.parse(storedEventItems));
        }

        setEventStarted(!!localStorage.getItem("eventStarted"));
    }, []);

    useEffect(() => {
        localStorage.setItem("eventItems", JSON.stringify(eventItems));
    }, [eventItems]);

    const handleAlimentSelect = (aliment) => {
        setSelectedAliments((prev) => [
            ...prev,
            { ...aliment, count: 1, id: Date.now() },
        ]);
        setTotal((prev) => prev + parseFloat(aliment.price));
    };

    const handleAlimentDeselect = (alimentId) => {
        const deselectedAliment = selectedAliments.find(
            (item) => item.id === alimentId
        );

        setSelectedAliments((prev) =>
            prev.filter((item) => item.id !== alimentId)
        );
        setTotal((prevTotal) => prevTotal - deselectedAliment.price);
    };

    const handlePlaceInSummary = (payments = []) => {
        if (selectedAliments.length === 0) return;

        const updatedOrderSummary = selectedAliments.reduce(
            (acc, aliment) => {
                if (acc[aliment.name]) {
                    acc[aliment.name].count += aliment.count;
                } else {
                    acc[aliment.name] = { ...aliment };
                }
                return acc;
            },
            { ...allOrders }
        );

        setOrderSummary(Object.values(updatedOrderSummary));
        setAllOrders(updatedOrderSummary);

        const newOrderCount = eventOrderCount + 1;
        setEventOrderCount(newOrderCount);
        localStorage.setItem("eventOrderCount", newOrderCount);

        localStorage.setItem(
            "eventSummary",
            JSON.stringify(Object.values(updatedOrderSummary))
        );

        setEventPayments((prev) => {
            const updatedPayments = payments.reduce((acc, payment) => {
                const currentAmount = acc[payment.label] || 0;
                acc[payment.label] = currentAmount + payment.amount;
                return acc;
            }, { ...prev });
            localStorage.setItem("eventPayments", JSON.stringify(updatedPayments));
            return updatedPayments;
        });

        setSelectedAliments([]);
        setTotal(0);
    };

    const handleExportSummaryCSV = () => {
        const csv = Papa.unparse(orderSummary);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `event-summary-${new Date().toLocaleDateString()}.csv`
        );
        link.click();
    };

    const moveItem = (fromIndex, toIndex) => {
        setEventItems((prevItems) => {
            const updatedItems = [...prevItems];
            const [movedItem] = updatedItems.splice(fromIndex, 1);
            updatedItems.splice(toIndex, 0, movedItem);
            return updatedItems;
        });
    };

    // View 1: Event Not Started (100vh Landing Page)
    if (!eventStarted) {
        return (
            <div className={styles.landingWrapper}>
                <header className={styles.topBar}>
                    <button className={styles.iconButton} onClick={() => navigate("/")}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Retour</span>
                    </button>
                    <h2 className={styles.pageTitle}>Ouverture d'Évènement</h2>
                </header>

                <div className={styles.landingContent}>
                    <div className={styles.landingCard}>
                        <FontAwesomeIcon icon={faCalendarAlt} className={styles.landingIcon} />
                        <h3>Service de l'Évènement</h3>
                        <button className={styles.primaryButton} onClick={handleStartDay}>
                            Commencer le service
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View 2: Event Started (Dashboard)
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.mainWrapper}>
                <header className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <button className={styles.iconButton} onClick={() => navigate("/")}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <h2 className={styles.pageTitle}>
                            Sommaire: {eventOrderCount} commande{eventOrderCount > 1 ? "s" : ""}
                        </h2>
                    </div>
                </header>

                <div className={styles.contentContainer}>
                    {/* Section 1: Register (Caisse) */}
                    <div className={styles.caisseSection}>
                        <div className={styles.menuColumn}>
                            <Aliments
                                aliments={eventItems}
                                onAlimentSelect={handleAlimentSelect}
                            />
                        </div>
                        <div className={styles.ticketColumn}>
                            <Ticket
                                selectedAliments={selectedAliments}
                                total={total}
                                onAlimentRemove={handleAlimentDeselect}
                                onPlaceInSummary={handlePlaceInSummary}
                            />
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Section 2: Summary Table */}
                    <div className={styles.summarySection}>
                        <div className={styles.summaryHeader}>
                            <h3><FontAwesomeIcon icon={faFileInvoiceDollar} /> Récapitulatif</h3>
                            <div className={styles.actionButtons}>
                                {orderSummary.length > 0 && (
                                    <button className={styles.secondaryButton} onClick={handleExportSummaryCSV}>
                                        Export CSV
                                    </button>
                                )}
                                <button className={styles.dangerButton} onClick={handleEndDay}>
                                    Terminer le service
                                </button>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.summaryTable}>
                                <thead>
                                    <tr>
                                        <th>Plat</th>
                                        <th>Quantité</th>
                                        <th>Prix Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderSummary.length === 0 ? (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>Aucune commande enregistrée</td></tr>
                                    ) : (
                                        orderSummary
                                            .sort((a, b) => b.count - a.count)
                                            .map((aliment, idx) => (
                                                <tr key={idx}>
                                                    <td>{aliment.name}</td>
                                                    <td>{aliment.count}</td>
                                                    <td>{(aliment.price * aliment.count).toFixed(2)} €</td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td><b>Total</b></td>
                                        <td>{eventOrderCount} cmd</td>
                                        <td>
                                            <b>
                                                {orderSummary
                                                    .reduce((acc, aliment) => acc + aliment.price * aliment.count, 0)
                                                    .toFixed(2)} €
                                            </b>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {Object.keys(eventPayments).length > 0 && (
                            <div className={styles.paymentSummary}>
                                <h4>Encaissements</h4>
                                <div className={styles.paymentSummaryGrid}>
                                    {Object.entries(eventPayments).map(([label, amount]) => (
                                        <div key={label} className={styles.paymentSummaryItem}>
                                            <span>{label}</span>
                                            <strong>{amount.toFixed(2)} €</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className={styles.divider} />

                    {/* Section 3: Menu Editor (event-specific) */}
                    <div className={styles.summarySection}>
                        <div className={styles.summaryHeader}>
                            <h3><FontAwesomeIcon icon={faPen} /> Modification du menu</h3>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddMenuItem();
                            }}
                            className={styles.menuForm}
                        >
                            <div className={styles.formGroup}>
                                <label htmlFor="menuItemName">Nom</label>
                                <input
                                    id="menuItemName"
                                    type="text"
                                    className={styles.formInput}
                                    value={newMenuItem.name}
                                    onChange={(e) =>
                                        setNewMenuItem({ ...newMenuItem, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="menuItemPrice">Prix</label>
                                <input
                                    id="menuItemPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={styles.formInput}
                                    value={newMenuItem.price}
                                    onChange={(e) =>
                                        setNewMenuItem({ ...newMenuItem, price: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.menuFormButton}>
                                Ajouter
                            </button>
                            <button
                                type="button"
                                className={`${styles.menuFormButton} ${styles.menuFormButtonSecondary}`}
                                onClick={() => {
                                    setEventItems((prevItems) => [
                                        ...prevItems,
                                        { name: "blank", price: 0, id: Date.now().toString() },
                                    ]);
                                }}
                            >
                                Ajouter un espace
                            </button>
                        </form>

                        {eventItems.length === 0 ? (
                            <p className={styles.emptyMenuHint}>Aucun plat pour le moment.</p>
                        ) : (
                            <ul className={styles.menuEditList}>
                                {eventItems.map((item, index) => (
                                    <DraggableMenuItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        moveItem={moveItem}
                                        removeItem={handleRemoveMenuItem}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default EventPage;
