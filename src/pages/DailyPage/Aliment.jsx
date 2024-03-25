const Aliment = ({ aliments, onAlimentSelect }) => {
  const handleAlimentSelect = (aliment) => {
    onAlimentSelect(aliment);
  };

  return (
    <div>
      <div className="aliments-grid">
        {aliments.map((aliment, index) => (
          <button
            key={index}
            className={`aliment-item aliment-item-${aliment.category}`}
            onClick={() => handleAlimentSelect(aliment)}
          >
            <div>
              {aliment.name} : {aliment.price} €
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Aliment;
