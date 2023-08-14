import React, { useEffect, useState } from "react";

import Aliment from "./Aliment";
import Ticket from "./Ticket";

import "./DailyPage.css";

import Papa from "papaparse";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import data from "./data.json";
import { useNavigate } from "react-router-dom";

function DailyPage() {
    const [selectedAliments, setSelectedAliments] = useState([]);
    const [total, setTotal] = useState(0);
    const [orderSummary, setOrderSummary] = useState([]);
    const [allOrders, setAllOrders] = useState({});

    const [dayStarted, setDayStarted] = useState(false);

    const handleStartDay = () => {
        localStorage.setItem("dayStarted", true);
        setDayStarted(true);
    };

    const handleEndDay = () => {
        const confirmEndDay = window.confirm(
            `Are you sure you want to end the day? The current data will be reset.`
        );
        if (confirmEndDay) {
            localStorage.removeItem("dayStarted");
            localStorage.removeItem("dailySummary");
            setOrderSummary([]);
            setAllOrders({});
            setDayStarted(false);
        }
    };

    useEffect(() => {
        const storedSummary = localStorage.getItem("dailySummary");
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
        if (localStorage.getItem("dayStarted")) {
            setDayStarted(true);
        } else {
            setDayStarted(false);
        }
    }, []);

    const handleAlimentSelect = (aliment) => {
        setSelectedAliments((prev) => {
            return [...prev, { ...aliment, count: 1, id: Date.now() }];
        });
        setTotal((prev) => prev + aliment.price);
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

    const handlePlaceInSummary = () => {
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
        localStorage.setItem(
            "dailySummary",
            JSON.stringify(Object.values(updatedOrderSummary))
        );

        setSelectedAliments([]);
        setTotal(0);
    };

    const handleExportSummary = () => {
        const jsonData = JSON.stringify(orderSummary);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `daily-summary-${new Date().toLocaleDateString()}.json`;
        link.href = url;
        link.click();
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
        <div className="daily-container">
            <button
                className="back-button"
                onClick={() => {
                    navigate("/");
                }}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {!dayStarted ? (
                <div>
                    <button className="button" onClick={handleStartDay}>
                        Commencer le service
                    </button>
                </div>
            ) : (
                <div>
                    <div>
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
                    <div className="summary">
                        <h2>Daily Summary:</h2>
                        <div className="summary-products">
                            {orderSummary.map((aliment, index) => (
                                <div key={index} className="summary-product">
                                    {aliment.name} x{aliment.count}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="summary-buttons">
                        {orderSummary.length > 0 && (
                            <>
                                <button
                                    className="button"
                                    onClick={handleExportSummary}
                                >
                                    Télécharger le résumé (JSON)
                                </button>
                                <button
                                    className="button"
                                    onClick={handleExportSummaryCSV}
                                >
                                    Télécharger le résumé (CSV)
                                </button>
                            </>
                        )}
                        <button className="button" onClick={handleEndDay}>
                            Terminer le service
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DailyPage;
