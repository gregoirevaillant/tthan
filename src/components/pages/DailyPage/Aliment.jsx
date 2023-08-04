const Aliment = ({ aliments, onAlimentSelect }) => {
    const handleAlimentSelect = (aliment) => {
        onAlimentSelect(aliment);
    };

    return (
        <div>
            <div className="aliments-grid">
                {aliments.map((aliment, index) => (
                    <div
                        key={index}
                        className={`aliment-item aliment-item-${aliment.category}`}
                        onClick={() => handleAlimentSelect(aliment)}
                    >
                        <div>
                            {aliment.name} : {aliment.price} €
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Aliment;
