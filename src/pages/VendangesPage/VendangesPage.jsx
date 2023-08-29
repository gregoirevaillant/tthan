import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import DishCard from "../../components/DishCard";
import "./VendangesPage.css";

function VendangesPage() {
    const initialPlatsCaisse1 = [
        { id: 1, nom: "Bún bò", quantite: 0, prix: 12 },
        { id: 8, nom: "Nouilles poulet", quantite: 0, prix: 11 },
        { id: 2, nom: "Nems poulet", quantite: 0, prix: 5.5 },
        { id: 3, nom: "Samoussa légumes", quantite: 0, prix: 5.5 },
        { id: 4, nom: "Bánh mì", quantite: 0, prix: 5.0 },
        { id: 9, nom: "Chips", quantite: 0, prix: 1.0 },
        { id: 5, nom: "Gaufre Choco / Cara", quantite: 0, prix: 3.5 },
        { id: 6, nom: "Gaufre Sucre", quantite: 0, prix: 2.5 },
        { id: 7, nom: "Fruits", quantite: 0, prix: 2.5 },
    ];

    const initialPlatsCaisse2 = [
        { id: 1, nom: "Bún bò", quantite: 0, prix: 12 },
        { id: 8, nom: "Bún bò", quantite: 0, prix: 11 },
        { id: 2, nom: "Nouilles poulet", quantite: 0, prix: 5.5 },
        { id: 3, nom: "Samoussa légumes", quantite: 0, prix: 5.5 },
        { id: 4, nom: "Bánh mì", quantite: 0, prix: 5.0 },
        { id: 9, nom: "chips", quantite: 0, prix: 1.0 },
        { id: 5, nom: "Gaufre Choco / Cara", quantite: 0, prix: 3.5 },
        { id: 6, nom: "Gaufre Sucre", quantite: 0, prix: 2.5 },
        { id: 7, nom: "Fruits", quantite: 0, prix: 2.5 },
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
        localStorage.setItem("platsCaisse2", JSON.stringify(platsCaisse2));
    }, [platsCaisse1, platsCaisse2]);

    const handleIncrement = (caisse, plat) => {
        if (caisse === "platsCaisse1") {
            const newPlats = [...platsCaisse1];
            const index = newPlats.indexOf(plat);
            newPlats[index] = { ...plat };
            newPlats[index].quantite++;
            setPlatsCaisse1(newPlats);
            localStorage.setItem("platsCaisse1", JSON.stringify(newPlats));
        } else if (caisse === "platsCaisse2") {
            const newPlats = [...platsCaisse2];
            const index = newPlats.indexOf(plat);
            newPlats[index] = { ...plat };
            newPlats[index].quantite++;
            setPlatsCaisse2(newPlats);
            localStorage.setItem("platsCaisse2", JSON.stringify(newPlats));
        }
    };

    const handleDecrement = (caisse, plat) => {
        if (caisse === "platsCaisse1") {
            if (plat.quantite === 0) return;
            const newPlats = [...platsCaisse1];
            const index = newPlats.indexOf(plat);
            newPlats[index] = { ...plat };
            newPlats[index].quantite--;
            setPlatsCaisse1(newPlats);
            localStorage.setItem("platsCaisse1", JSON.stringify(newPlats));
        } else if (caisse === "platsCaisse2") {
            if (plat.quantite === 0) return;
            const newPlats = [...platsCaisse2];
            const index = newPlats.indexOf(plat);
            newPlats[index] = { ...plat };
            newPlats[index].quantite--;
            setPlatsCaisse2(newPlats);
            localStorage.setItem("platsCaisse2", JSON.stringify(newPlats));
        }
    };

    const getTotalCount = (plats) => {
        const totals = {};
        plats.forEach((plat) => {
            totals[plat.id] = (totals[plat.id] || 0) + plat.quantite;
        });
        return totals;
    };

    const totalCombined = getTotalCount([...platsCaisse1, ...platsCaisse2]);

    const reset = () => {
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
    };

    const resetConfirmation = () => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir réinitialiser les statistiques ?"
            )
        ) {
            reset();
        }
    };

    const navigate = useNavigate();

    return (
        <>
            <div className="app">
                <div className="app-wrapper">
                    <div className="column" id="caisseOne">
                        <button
                            className="back-button"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <h2 className="column-title">Caisse Nº1</h2>
                        <div className="dishes-container">
                            {platsCaisse1.map((plat) => (
                                <DishCard
                                    key={plat.id}
                                    plat={plat}
                                    onIncrement={() =>
                                        handleIncrement("platsCaisse1", plat)
                                    }
                                    onDecrement={() =>
                                        handleDecrement("platsCaisse1", plat)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div className="column" id="caisseTwo">
                        <h2 className="column-title">Caisse Nº2</h2>
                        <div className="dishes-container">
                            {platsCaisse2.map((plat) => (
                                <DishCard
                                    key={plat.id}
                                    plat={plat}
                                    onIncrement={() =>
                                        handleIncrement("platsCaisse2", plat)
                                    }
                                    onDecrement={() =>
                                        handleDecrement("platsCaisse2", plat)
                                    }
                                />
                            ))}
                        </div>
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
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VendangesPage;
