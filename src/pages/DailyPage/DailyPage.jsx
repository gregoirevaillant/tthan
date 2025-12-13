import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Aliment from "./Aliment";
import data from "./data.json";
import Ticket from "./Ticket";

import styles from "./DailyPage.module.css";

function DailyPage() {
    const [selectedAliments, setSelectedAliments] = useState([]);
    const [total, setTotal] = useState(0);
    const [orderSummary, setOrderSummary] = useState([]);
    const [allOrders, setAllOrders] = useState({});
    const [dayStarted, setDayStarted] = useState(false);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [dailyOrderCount, setDailyOrderCount] = useState(0);

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

    const navigate = useNavigate();

    return (
        <div className={styles.wrapper}>
            <button className={styles.backButton} onClick={() => navigate("/")}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2>{`Sommaire: ${dailyOrderCount} commande${
                dailyOrderCount > 1 ? "s" : ""
            }`}</h2>
            {!dayStarted ? (
                <button
                    className={styles.summaryButton}
                    onClick={handleStartDay}
                >
                    Commencer le service
                </button>
            ) : (
                <>
                    <div className={styles.caisseWrapper}>
                        <Aliment
                            aliments={data}
                            onAlimentSelect={handleAlimentSelect}
                        />
                        <Ticket
                            selectedAliments={selectedAliments}
                            total={total}
                            onAlimentRemove={handleAlimentDeselect}
                            onPlaceInSummary={handlePlaceInSummary}
                        />
                    </div>

                    <div className={styles.summaryContainer}>
                        <h2>{`Sommaire: ${dailyOrderCount} commande${
                            dailyOrderCount > 1 ? "s" : ""
                        }`}</h2>
                        <table className={styles.summaryTable}>
                            <thead className={styles.summaryTableHead}>
                                <tr className={styles.summaryTableRow}>
                                    <th className={styles.summaryTableHeader}>
                                        Plat
                                    </th>
                                    <th className={styles.summaryTableHeader}>
                                        Quantité
                                    </th>
                                    <th className={styles.summaryTableHeader}>
                                        Prix Total (€)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.summaryTableBody}>
                                {orderSummary
                                    .sort((a, b) => b.count - a.count)
                                    .map((aliment, idx) => (
                                        <tr
                                            key={idx}
                                            className={styles.summaryTableRow}
                                            style={{
                                                backgroundColor:
                                                    idx % 2 === 0
                                                        ? "#f2f2f2"
                                                        : "#fff",
                                            }}
                                        >
                                            <td
                                                className={
                                                    styles.summaryTableData
                                                }
                                            >
                                                {aliment.name}
                                            </td>
                                            <td
                                                className={
                                                    styles.summaryTableData
                                                }
                                            >
                                                {aliment.count}
                                            </td>
                                            <td
                                                className={
                                                    styles.summaryTableData
                                                }
                                            >
                                                {aliment.price * aliment.count}
                                            </td>
                                        </tr>
                                    ))}
                                <tr className={styles.summaryTableRow}>
                                    <td className={styles.summaryTableData}>
                                        <b>Total quotidien</b>
                                    </td>
                                    <td
                                        className={styles.summaryTableData}
                                    ></td>
                                    <td className={styles.summaryTableData}>
                                        {dailyTotal} €
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.summaryButtons}>
                            {orderSummary.length > 0 && (
                                <button
                                    className={styles.summaryButton}
                                    onClick={handleExportSummaryCSV}
                                >
                                    Télécharger le résumé (CSV)
                                </button>
                            )}
                            <button
                                className={styles.summaryButton}
                                onClick={handleEndDay}
                            >
                                Terminer le service
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DailyPage;
