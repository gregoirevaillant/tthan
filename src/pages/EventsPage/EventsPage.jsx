import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faTrash,
    faPlus,
    faMinus,
    faFileExport,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { Button, Table, Form } from "react-bootstrap";

import Papa from "papaparse";

function EventsPage() {
    const [validated, setValidated] = useState(false);

    const [plats, setPlats] = useState(() => {
        const storedPlats = JSON.parse(localStorage.getItem("plats"));
        return storedPlats;
    });

    console.log(plats);

    useEffect(() => {
        localStorage.setItem("plats", JSON.stringify(plats));
    }, [plats]);

    const [newPlatName, setNewPlatName] = useState("");
    const [newPlatPrice, setNewPlatPrice] = useState("");

    const handleQuantityChange = (plat, increment) => {
        const updatedPlats = plats.map((p) => {
            if (p.id === plat.id) {
                return {
                    ...p,
                    quantite: Math.max(p.quantite + (increment ? 1 : -1), 0),
                };
            }
            return p;
        });

        setPlats(updatedPlats);
    };

    const handleAddNewPlat = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const randID = Math.floor(
            Math.random() * (Math.floor(9999) - Math.ceil(999)) + Math.ceil(999)
        ).toString();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (newPlatName && newPlatPrice > 0) {
                const newPlat = {
                    id: randID,
                    nom: newPlatName,
                    quantite: 0,
                    prix: newPlatPrice,
                };
                if (plats) {
                    setPlats([...plats, newPlat]);
                } else {
                    setPlats([newPlat]);
                }

                setNewPlatName("");
                setNewPlatPrice("");
            }
        }

        setValidated(true);
    };

    const handleRemovePlat = (platId) => {
        if (!window.confirm("Voulez-vous supprimer ce plat ?")) {
            return;
        }

        const updatedPlats = plats.filter((plat) => plat.id !== platId);
        setPlats(updatedPlats);
    };

    const navigate = useNavigate();

    const handleExportSummary = () => {
        const jsonData = JSON.stringify(plats);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `daily-summary-${new Date().toLocaleDateString()}.json`;
        link.href = url;
        link.click();
    };

    const handleExportSummaryCSV = () => {
        const csv = Papa.unparse(plats);
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

    return (
        <div className="p-5 bg-red-100 overflow-hidden bg-light">
            <div className="min-vh-100">
                <Button onClick={() => navigate("/")} variant="primary">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                {plats ? (
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        {plats.map((plat) => (
                            <div
                                key={plat.id}
                                className="d-flex justify-content-between align-items-center my-2 gap-5 border border-2 border-primary p-3 rounded w-50"
                            >
                                <div>
                                    <h3 className="m-0">
                                        {plat.nom} - {plat.prix}€
                                        &nbsp;&nbsp;&nbsp;
                                        <span className="badge bg-primary rounded-pill">
                                            x{plat.quantite}
                                        </span>
                                    </h3>
                                </div>
                                <div className="d-flex justify-content-center align-items-center gap-5">
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            handleQuantityChange(plat, true)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            handleQuantityChange(plat, false)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h1 className="text-center">Aucun plat</h1>
                        <p className="text-center">
                            Ajoutez un plat pour commencer
                        </p>
                    </div>
                )}
            </div>

            <Table striped bordered>
                <thead>
                    <tr>
                        <th className="text-center bg-primary text-white">
                            Plat
                        </th>
                        <th className="text-center bg-primary text-white">
                            Quantité
                        </th>
                        <th className="text-center bg-primary text-white">
                            Prix Total (€)
                        </th>
                        <th className="text-center bg-primary text-white">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {plats ? (
                        <>
                            {plats.map((plat) => (
                                <tr key={plat.id}>
                                    <td className="text-center">{plat.nom}</td>
                                    <td className="text-center">
                                        {plat.quantite}
                                    </td>
                                    <td className="text-center">
                                        {(plat.quantite * plat.prix).toFixed(2)}
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleRemovePlat(plat.id)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center align-items-center gap-3">
                <h3>Total : </h3>
                <h3>
                    {plats ? (
                        <>
                            {plats

                                .reduce(
                                    (acc, plat) =>
                                        acc + plat.quantite * plat.prix,
                                    0
                                )
                                .toFixed(2)}
                            €
                        </>
                    ) : (
                        <></>
                    )}
                </h3>
            </div>
            <div className="d-flex gap-2">
                <Button onClick={handleExportSummary}>
                    <FontAwesomeIcon icon={faFileExport} /> JSON
                </Button>
                <Button onClick={handleExportSummaryCSV}>
                    <FontAwesomeIcon icon={faFileExport} /> CSV
                </Button>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h3 className="text-center">Ajouter un nouveau plat :</h3>
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleAddNewPlat}
                    className="d-flex flex-row justify-content-center align-items-end gap-3"
                >
                    <Form.Group controlId="validationCustom01">
                        <Form.Label>Plat</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nom du plat"
                            value={newPlatName}
                            onChange={(e) => setNewPlatName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="validationCustom02">
                        <Form.Label>Prix</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Prix du plat"
                            value={newPlatPrice}
                            required
                            onChange={(e) =>
                                setNewPlatPrice(parseFloat(e.target.value))
                            }
                        />
                    </Form.Group>
                    <Button variant="success" onClick={handleAddNewPlat}>
                        Ajouter
                    </Button>
                </Form>
                <Button
                    variant="danger"
                    onClick={() => {
                        if (plats.length === 0) {
                            return;
                        }
                        if (
                            window.confirm(
                                "Êtes-vous sûr de vouloir supprimer tous les plats ?"
                            )
                        ) {
                            setPlats([]);
                            localStorage.removeItem("plats");
                        }
                    }}
                    className="my-5"
                >
                    Supprimer tous les plats
                </Button>
            </div>
        </div>
    );
}

export default EventsPage;
