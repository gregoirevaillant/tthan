import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

import Aliment from "./Aliment";
import Ticket from "./Ticket";
import styles from "./EventPage.module.css";

function EventPage() {
  const [selectedAliments, setSelectedAliments] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderSummary, setOrderSummary] = useState([]);
  const [allOrders, setAllOrders] = useState({});
  const [dayStarted, setDayStarted] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: 0
  });

  const handleAddMenuItem = () => {
    setMenuItems((prevItems) => [...prevItems, { ...newMenuItem, id: Date.now().toString() }]);
    setNewMenuItem({ name: "", price: 0 });
  };

  const handleRemoveMenuItem = (itemId) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

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

    const storedMenuItems = localStorage.getItem("menuItems");
    if (storedMenuItems) {
      setMenuItems(JSON.parse(storedMenuItems));
    }

    if (localStorage.getItem("dayStarted")) {
      setDayStarted(true);
    } else {
      setDayStarted(false);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

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
    <div className={styles['event-container']}>
      <button
        className={styles['back-button']}
        onClick={() => {
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      {!dayStarted ? (
        <div>
          <button className={styles.button} onClick={handleStartDay}>
            Commencer le service
          </button>
        </div>
      ) : (
        <div>
          <div>
            <div>
              <Aliment
                aliments={menuItems}
                onAlimentSelect={handleAlimentSelect}
              />
              <Ticket
                selectedAliments={selectedAliments}
                total={total}
                onAlimentRemove={handleAlimentDeselect}
                onPlaceInSummary={handlePlaceInSummary}
              />
            </div>
            <div className={styles['summary-container']}>
              <h2>Daily Summary:</h2>
              <table className={styles['summary-table']}>
                <thead>
                  <tr>
                    <th>Plat</th>
                    <th>Quantité vendue</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderSummary.map((aliment, index) => (
                    <tr key={index}>
                      <td>{aliment.name}</td>
                      <td>{aliment.count}</td>
                      <td>{(aliment.count * aliment.price).toFixed(2)}€</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2">Total du service</td>
                    <td>
                      {orderSummary.reduce(
                        (total, aliment) => total + aliment.count * aliment.price,
                        0
                      ).toFixed(2)}€
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles['summary-buttons']}>
              {orderSummary.length > 0 && (
                <button
                  className={styles['summary-button']}
                  onClick={handleExportSummaryCSV}
                >
                  Télécharger le résumé (CSV)
                </button>
              )}
              <button className={styles['summary-button']} onClick={handleEndDay}>
                Terminer le service
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMenuItem();
              }}
              className={styles['form-container']}
            >
              <label className={styles['form-label']}>
                Name:

                <input
                  type="text"
                  className={styles['form-input']}
                  name="name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  required
                />
              </label>
              <label className={styles['form-label']}>
                Price:
                <input
                  className={styles['form-input']}
                  type="number"
                  name="price"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) })}
                  required
                  />
              </label>
                
              <button   className={styles['form-button']} type="submit">Add Menu Item</button>
            </form>
            <ul 
            className={styles['menu-list']}
            >
              {menuItems.map((item) => (
                <li key={item.id} className={styles['menu-item']}>
                  {item.name} - {item.price}€{" "}
                  <button onClick={() => handleRemoveMenuItem(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventPage;
