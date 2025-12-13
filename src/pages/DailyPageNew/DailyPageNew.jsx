import { faArrowLeft, faUtensils, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Aliments from "./Aliments";
import data from "./data.json";
import Ticket from "./Ticket";

import styles from "./DailyPage.module.css";

function DailyPageNew() {
    const [selectedAliments, setSelectedAliments] = useState([]);
    const [total, setTotal] = useState(0);
    const [orderSummary, setOrderSummary] = useState([]);
    const [allOrders, setAllOrders] = useState({});
    const [dayStarted, setDayStarted] = useState(false);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [dailyOrderCount, setDailyOrderCount] = useState(0);
    const navigate = useNavigate();

    const handleStartDay = () => {
        localStorage.setItem("dayStarted", true);
        setDayStarted(true);
    };

    const handleEndDay = () => {
        const confirmEndDay = window.confirm(
            `Etes vous sur de vouloir terminer le service ?\n\nLe résumé du jour sera supprimé.`
        );
        if (confirmEndDay) {
            localStorage.removeItem("dayStarted");
            localStorage.removeItem("dailySummary");
            localStorage.removeItem("dailyTotal");
            localStorage.removeItem("dailyOrderCount");
            setDailyTotal(0);
            setDailyOrderCount(0);
            setOrderSummary([]);
            setAllOrders({});
            setDayStarted(false);
        }
    };

    useEffect(() => {
        const storedSummary = localStorage.getItem("dailySummary");
        const storedDailyTotal = localStorage.getItem("dailyTotal");
        const storedDailyOrderCount = localStorage.getItem("dailyOrderCount");
        if (storedDailyTotal) setDailyTotal(parseFloat(storedDailyTotal));
        if (storedDailyOrderCount)
            setDailyOrderCount(parseFloat(storedDailyOrderCount));
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
        setDayStarted(!!localStorage.getItem("dayStarted"));
    }, []);

    const handleAlimentSelect = (aliment) => {
        setSelectedAliments((prev) => [
            ...prev,
            { ...aliment, count: 1, id: Date.now() },
        ]);
        setTotal((prev) => prev + aliment.price);
    };

    const handleAlimentDeselect = (alimentId) => {
        const deselected = selectedAliments.find(
            (item) => item.id === alimentId
        );
        setSelectedAliments((prev) =>
            prev.filter((item) => item.id !== alimentId)
        );
        setTotal((prev) => prev - deselected.price);
    };

    const handlePlaceInSummary = () => {
        if (selectedAliments.length === 0) return;

        const updatedOrderSummary = selectedAliments.reduce(
            (acc, aliment) => {
                if (acc[aliment.name]) acc[aliment.name].count += aliment.count;
                else acc[aliment.name] = { ...aliment };
                return acc;
            },
            { ...allOrders }
        );

        setOrderSummary(Object.values(updatedOrderSummary));
        setAllOrders(updatedOrderSummary);
        localStorage.setItem(
            "dailySummary",
            JSON.stringify(Object.values(updatedOrderSummary))
        );
        const updatedDailyTotal = dailyTotal + total;
        localStorage.setItem("dailyTotal", updatedDailyTotal);
        setDailyTotal(updatedDailyTotal);
        setDailyOrderCount((prev) => {
            const newCount = prev + 1;
            localStorage.setItem("dailyOrderCount", newCount);
            return newCount;
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
            `daily-summary-${new Date().toLocaleDateString()}.csv`
        );
        link.click();
    };

    // --- Render Logic ---

    // View 1: Day Not Started (100vh Landing Page)
    if (!dayStarted) {
        return (
            <div className={styles.landingWrapper}>
                <header className={styles.topBar}>
                    <button className={styles.iconButton} onClick={() => navigate("/")}>
                        <FontAwesomeIcon icon={faArrowLeft} /> 
                        <span>Retour</span>
                    </button>
                    <h2 className={styles.pageTitle}>Ouverture de Caisse</h2>
                </header>
                
                <div className={styles.landingContent}>
                    <div className={styles.landingCard}>
                        <FontAwesomeIcon icon={faUtensils} className={styles.landingIcon} />
                        <h3>Service du Jour</h3>
                        <button className={styles.primaryButton} onClick={handleStartDay}>
                            Commencer le service
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View 2: Day Started (Dashboard)
    return (
        <div className={styles.mainWrapper}>
            {/* Sticky Header */}
            <header className={styles.topBar}>
                <div className={styles.topBarLeft}>
                    <button className={styles.iconButton} onClick={() => navigate("/")}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h2 className={styles.pageTitle}>
                        Sommaire: {dailyOrderCount} commande{dailyOrderCount > 1 ? "s" : ""}
                    </h2>
                </div>
                <div className={styles.topBarRight}>
                    {/* <div className={styles.totalBadge}>
                        Total Jour: {dailyTotal} €
                    </div> */}
                </div>
            </header>

            <div className={styles.contentContainer}>
                {/* Section 1: Register (Caisse) */}
                <div className={styles.caisseSection}>
                    <div className={styles.menuColumn}>
                        <Aliments
                            aliments={data}
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
                                    <tr><td colSpan="3" style={{textAlign:'center', padding: '2rem'}}>Aucune commande enregistrée</td></tr>
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
                                    <td>{dailyOrderCount} cmd</td>
                                    <td><b>{dailyTotal} €</b></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailyPageNew;