import styles from "./DailyPage.module.css";

const Aliment = ({ aliments, onAlimentSelect }) => {
    return (
        <div>
            <div className={styles.alimentsGrid}>
                {aliments.map((aliment) =>
                    aliment.price === 0 ? (
                        <div></div>
                    ) : (
                        <button
                            key={JSON.stringify(aliment)}
                            className={styles.alimentItem}
                            onClick={() => onAlimentSelect(aliment)}
                        >
                            <div>
                                {aliment.name} : {aliment.price} €
                            </div>
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Aliment;
