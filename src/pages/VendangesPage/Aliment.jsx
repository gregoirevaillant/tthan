import styles from './Aliment.module.css';

const Aliment = ({ aliments, onAlimentSelect }) => {
  const handleAlimentSelect = (aliment) => {
    onAlimentSelect(aliment);
  };

  return (
    <div>
      <div className={styles['aliments-grid']}>
        {aliments.map((aliment, index) => {
          return aliment.id === "0" ?         
            <div></div>
           : 
            <button
              key={index}
              className={styles['aliment-item']}
              onClick={() => handleAlimentSelect(aliment)}
              style={{
                border: `5px solid ${aliment.color}`
              }}
            >
              <span className={styles['aliment-item-text']}>
                {aliment.name} : {aliment.price} €
              </span>
            </button>
        })}
      </div>
    </div>
  );
};

export default Aliment;
