import styles from "./Aliments.module.css";

const Aliments = ({ aliments, onAlimentSelect }) => {
    if (aliments.length === 0) {
        return (
            <div className={styles.alimentsGrid}>
                <p className={styles.emptyMenu}>
                    Ajoutez des plats dans "Modification du menu" pour commencer.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.alimentsGrid}>
            {aliments.map((aliment, index) => {
                const price = Number(aliment.price) || 0;
                if (price === 0) {
                    return <div key={aliment.id || index} className={styles.alimentSpacer}></div>;
                }

                return (
                    <button
                        key={aliment.id || index}
                        className={styles.alimentCard}
                        onClick={() => onAlimentSelect({ ...aliment, price })}
                    >
                        <span className={styles.alimentName}>{aliment.name}</span>
                        <span className={styles.alimentPrice}>{price.toFixed(2)} €</span>
                    </button>
                );
            })}
        </div>
    );
};

export default Aliments;
