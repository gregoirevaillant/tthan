import { useEffect, useState } from "react";

import "./App.css";

import DishCard from "./components/UI/DishCard";
import { useNavigate } from "react-router-dom";

function App() {
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
            window.confirm("Êtes-vous sûr de vouloir reset les statistiques ?")
        ) {
            setPlatsCaisse1(initialPlatsCaisse1);
            setPlatsCaisse2(initialPlatsCaisse2);
        }
    };

    const navigate = useNavigate();

    return (
        <div className="app">
            <button
                onClick={() => {
                    navigate("/vendanges");
                }}
            >
                Get Products
            </button>
            <div className="app-wrapper">
                <div className="column" id="caisseOne">
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
                    <h2 className="column-title">Total quantité :</h2>
                    {Object.keys(totalCombined).map((id) => (
                        <div key={id} className="quantity-wrapper">
                            <p className="quantity">
                                <b>
                                    {
                                        platsCaisse1
                                            .concat(platsCaisse2)
                                            .find(
                                                (plat) =>
                                                    plat.id === parseInt(id)
                                            ).nom
                                    }
                                </b>{" "}
                                : <b>{totalCombined[id]}</b> pour{" "}
                                <b>
                                    {totalCombined[id] *
                                        platsCaisse1
                                            .concat(platsCaisse2)
                                            .find(
                                                (plat) =>
                                                    plat.id === parseInt(id)
                                            ).prix}
                                </b>{" "}
                                €
                            </p>
                        </div>
                    ))}
                    <div>
                        <h2 className="column-title">Revenu total :</h2>
                        <span className="total-revenue">
                            <b>
                                {platsCaisse1
                                    .concat(platsCaisse2)
                                    .reduce(
                                        (acc, plat) =>
                                            acc + plat.quantite * plat.prix,
                                        0
                                    )}
                            </b>{" "}
                            €
                        </span>
                    </div>
                    <div>
                        <h2 className="column-title">Reset les statistiques</h2>
                        <button
                            className="button primarys"
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
    );
}

export default App;
