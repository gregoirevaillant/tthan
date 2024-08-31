import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

import data from "./data.json";
import Aliment from "./Aliment";
import Ticket from "./Ticket";
import styles from "./VendangesPage.module.css";

function VendangesPage() {
  const [selectedAliments, setSelectedAliments] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderSummary, setOrderSummary] = useState([]);
  const [allOrders, setAllOrders] = useState({});
  const [dailyTotal, setDailyTotal] = useState(0);
  const [isAccordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    const storedSummary = localStorage.getItem("dailySummary");
    const storedDailyTotal = localStorage.getItem("dailyTotal");
    if (storedDailyTotal) {
      setDailyTotal(parseFloat(storedDailyTotal));
    }
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

    setSelectedAliments((prev) => prev.filter((item) => item.id !== alimentId));
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
    const updatedDailyTotal = dailyTotal + total;
    localStorage.setItem("dailyTotal", updatedDailyTotal);
    setDailyTotal(updatedDailyTotal);

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
    <div className={styles["vendanges-container"]}>
      <button
        className={styles["back-button"]}
        onClick={() => {
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className={styles["container"]}>
        <div>
          <Aliment aliments={data} onAlimentSelect={handleAlimentSelect} />
          <Ticket
            selectedAliments={selectedAliments}
            total={total}
            onAlimentRemove={handleAlimentDeselect}
            onPlaceInSummary={handlePlaceInSummary}
          />
        </div>
        <div className={styles["summary-container"]}>
          <button
            className={styles["accordion-header"]}
            onClick={() => setAccordionOpen((prev) => !prev)}
          >
            <span>Daily Summary:</span>
            <FontAwesomeIcon
              icon={isAccordionOpen ? faChevronUp : faChevronDown}
              className={`${styles["accordion-toggle"]} ${
                isAccordionOpen ? styles["open"] : ""
              }`}
            />
          </button>
          {isAccordionOpen && (
            <div className={styles["accordion-content"]}>
              <table className={styles["summary-table"]}>
                <thead className={styles["summary-table-head"]}>
                  <tr className={styles["summary-table-row"]}>
                    <th className={styles["summary-table-header"]}>Plat</th>
                    <th className={styles["summary-table-header"]}>Quantité</th>
                    <th className={styles["summary-table-header"]}>
                      Prix Total (€)
                    </th>
                  </tr>
                </thead>
                <tbody className={styles["summary-table-body"]}>
                  {orderSummary
                    .sort((a, b) => b.count - a.count)
                    .map((aliment, index) => (
                      <tr
                        className={styles["summary-table-row"]}
                        key={index}
                        style={
                          index % 2 === 0
                            ? { backgroundColor: "#f2f2f2" }
                            : { backgroundColor: "#fff" }
                        }
                      >
                        <td className={styles["summary-table-data"]}>
                          {aliment.name}
                        </td>
                        <td className={styles["summary-table-data"]}>
                          {aliment.count}
                        </td>
                        <td className={styles["summary-table-data"]}>
                          {aliment.price * aliment.count}
                        </td>
                      </tr>
                    ))}
                  <tr className={styles["summary-table-row"]}>
                    <td className={styles["summary-table-data"]}>
                      <b>Total quotidien</b>
                    </td>
                    <td className={styles["summary-table-data"]}></td>
                    <td className={styles["summary-table-data"]}>
                      {dailyTotal} €
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={styles["summary-buttons"]}>
                {orderSummary.length > 0 && (
                  <button
                    className={styles["summary-button"]}
                    onClick={handleExportSummaryCSV}
                  >
                    Télécharger le résumé (CSV)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendangesPage;
