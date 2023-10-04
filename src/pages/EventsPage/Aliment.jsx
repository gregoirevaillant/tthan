import styles from "./EventPage.module.css"

const Aliment = ({ aliments, onAlimentSelect }) => {
    const handleAlimentSelect = (aliment) => {
      onAlimentSelect(aliment);
    };
    
    const styleValue = (price) => {
      if (price === 0)
        return 0 
      else 
        return 1
    }

    return (
      <div>
        <div className={styles['aliments-grid']}>
          {aliments.map((aliment, index) => (
            <div
              key={index}
              // className={`aliment-item ${aliment.price === 0 ? "hidden" : ""}`}
              className={styles['aliment-item']}
              style={{opacity: styleValue(aliment.price), pointerEvents: styleValue(aliment.price) ? "cursor" : 'none'}}
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
  