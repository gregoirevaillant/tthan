import styles from "./Aliments.module.css";

const Aliments = ({ aliments, onAlimentSelect }) => {
    
    const getCategoryClass = (category) => {
        switch (category) {
            case "plat":
                return styles.catPlat;
            case "boisson":
                return styles.catBoisson;
            case "dessert":
                return styles.catDessert;
            case "autre":
                return styles.catAutre;
            default:
                return "";
        }
    };

    return (
        <div className={styles.alimentsGrid}>
            {aliments.map((aliment, index) => {
                if (aliment.price === 0) {
                    return <div key={index} className={styles.alimentSpacer}></div>;
                }

                return (
                    <button
                        key={aliment.id || index}
                        className={`${styles.alimentCard} ${getCategoryClass(aliment.category)}`}
                        onClick={() => onAlimentSelect(aliment)}
                    >
                        <span className={styles.alimentName}>{aliment.name}</span>
                        <span className={styles.alimentPrice}>
                            {aliment.price.toFixed(2)} €
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default Aliments;