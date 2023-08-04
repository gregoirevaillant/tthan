import { useEffect, useState } from "react";

import DishCard from "../UI/DishCard";
import "./VendangesPage.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function VendangesPage() {
    const initialPlatsCaisse1 = [
        { id: 102, nom: "Bún bò", quantite: 0, prix: 11.5 },
        { id: 103, nom: "Nems poulet", quantite: 0, prix: 5.5 },
        { id: 104, nom: "Samoussa légumes", quantite: 0, prix: 5.5 },
        { id: 101, nom: "Bánh mì", quantite: 0, prix: 5.0 },
        { id: 107, nom: "Gaufre Choco / Cara", quantite: 0, prix: 3.5 },
        { id: 106, nom: "Gaufre Sucre", quantite: 0, prix: 2.5 },
        { id: 105, nom: "Fruits", quantite: 0, prix: 2.5 },
    ];

    const initialPlatsCaisse2 = [
        { id: 102, nom: "Bún bò", quantite: 0, prix: 11.5 },
        { id: 103, nom: "Nems poulet", quantite: 0, prix: 5.5 },
        { id: 104, nom: "Samoussa légumes", quantite: 0, prix: 5.5 },
        { id: 101, nom: "Bánh mì", quantite: 0, prix: 5.0 },
        { id: 107, nom: "Gaufre Choco / Cara", quantite: 0, prix: 3.5 },
        { id: 106, nom: "Gaufre Sucre", quantite: 0, prix: 2.5 },
        { id: 105, nom: "Fruits", quantite: 0, prix: 2.5 },
    ];

    const [platsCaisse1, setPlatsCaisse1] = useState(() => {
        const storedPlats = JSON.parse(localStorage.getItem("platsCaisse1"));
        return storedPlats || initialPlatsCaisse1;
    });

    const [platsCaisse2, setPlatsCaisse2] = useState(() => {
        const storedPlats = JSON.parse(localStorage.getItem("platsCaisse2"));
        return storedPlats || initialPlatsCaisse2;
    });

    useEffect(() => {
        localStorage.setItem("platsCaisse1", JSON.stringify(platsCaisse1));
    }, [platsCaisse1]);

    useEffect(() => {
        localStorage.setItem("platsCaisse2", JSON.stringify(platsCaisse2));
    }, [platsCaisse2]);

    const handleIncrementCaisse1 = (plat) => {
        const newPlats = [...platsCaisse1];
        const index = newPlats.indexOf(plat);
        newPlats[index] = { ...plat };
        newPlats[index].quantite++;
        setPlatsCaisse1(newPlats);
        localStorage.setItem("platsCaisse1", JSON.stringify(newPlats));
    };

    const handleIncrementCaisse2 = (plat) => {
        const newPlats = [...platsCaisse2];
        const index = newPlats.indexOf(plat);
        newPlats[index] = { ...plat };
        newPlats[index].quantite++;
        setPlatsCaisse2(newPlats);
        localStorage.setItem("platsCaisse2", JSON.stringify(newPlats));
    };

    const handleDecrementCaisse1 = (plat) => {
        if (plat.quantite === 0) return;
        const newPlats = [...platsCaisse1];
        const index = newPlats.indexOf(plat);
        newPlats[index] = { ...plat };
        newPlats[index].quantite--;
        setPlatsCaisse1(newPlats);
        localStorage.setItem("platsCaisse1", JSON.stringify(newPlats));
    };

    const handleDecrementCaisse2 = (plat) => {
        if (plat.quantite === 0) return;
        const newPlats = [...platsCaisse2];
        const index = newPlats.indexOf(plat);
        newPlats[index] = { ...plat };
        newPlats[index].quantite--;
        setPlatsCaisse2(newPlats);
        localStorage.setItem("platsCaisse2", JSON.stringify(newPlats));
    };

    const getTotalCount = (plats) => {
        const totals = {};
        plats.forEach((plat) => {
            totals[plat.id] = (totals[plat.id] || 0) + plat.quantite;
        });
        return totals;
    };

    const totalCombined = getTotalCount([...platsCaisse1, ...platsCaisse2]);

    const resetConfirmation = () => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir réinitialiser les statistiques ?"
            )
        ) {
            setPlatsCaisse1(initialPlatsCaisse1);
            setPlatsCaisse2(initialPlatsCaisse2);
            localStorage.setItem(
                "platsCaisse1",
                JSON.stringify(initialPlatsCaisse1)
            );
            localStorage.setItem(
                "platsCaisse2",
                JSON.stringify(initialPlatsCaisse2)
            );
        }
    };

    return (
        <>
            <div className="app">
                <div className="app-wrapper">
                    <div className="column" id="caisseOne">
                        <button
                            className="back-button"
                            onClick={() => {
                                window.location.href = "/tthan";
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <h2 className="column-title">Caisse Nº1</h2>
                        {platsCaisse1.map((plat) => (
                            <DishCard
                                key={plat.id}
                                plat={plat}
                                onIncrement={handleIncrementCaisse1}
                                onDecrement={handleDecrementCaisse1}
                            />
                        ))}
                    </div>
                    <div className="column" id="caisseTwo">
                        <h2 className="column-title">Caisse Nº2</h2>
                        {platsCaisse2.map((plat) => (
                            <DishCard
                                key={plat.id}
                                plat={plat}
                                onIncrement={handleIncrementCaisse2}
                                onDecrement={handleDecrementCaisse2}
                            />
                        ))}
                    </div>
                    <div className="column" id="quantityTotal">
                        <h2 className="column-title">Les statistiques</h2>
                        <div className="quantity-table-wrapper">
                            <table className="quantity-table">
                                <thead>
                                    <tr>
                                        <th>Plat</th>
                                        <th>Quantité</th>
                                        <th>Prix Total (€)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(totalCombined).map((id) => {
                                        const plat = platsCaisse1
                                            .concat(platsCaisse2)
                                            .find(
                                                (plat) =>
                                                    plat.id === parseInt(id)
                                            );
                                        return (
                                            <tr key={id}>
                                                <td>{plat.nom}</td>
                                                <td>{totalCombined[id]}</td>
                                                <td>
                                                    {(
                                                        totalCombined[id] *
                                                        plat.prix
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="total-revenue-wrapper">
                            <h2 className="column-title">Les revenus</h2>
                            <span className="total-revenue">
                                <b>
                                    {platsCaisse1
                                        .concat(platsCaisse2)
                                        .reduce(
                                            (acc, plat) =>
                                                acc + plat.quantite * plat.prix,
                                            0
                                        )
                                        .toFixed(2)}
                                </b>{" "}
                                €
                            </span>
                        </div>
                        <div className="reset-button-wrapper">
                            <h2 className="column-title">
                                Réinitialiser les statistiques
                            </h2>
                            <button
                                className="button primary"
                                onClick={() => {
                                    resetConfirmation();
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VendangesPage;
