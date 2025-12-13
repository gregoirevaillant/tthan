import { 
    faUtensils, 
    faWineGlass, 
    faCalendarAlt, 
    faCashRegister, 
    faLeaf,
    faTrashRestore
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeButton from "./components/HomeButton";

import styles from "./Home.module.css";

function Home() {
    const handleResetAll = () => {
        const confirmReset = window.confirm(
            "⚠️ Êtes-vous sûr de vouloir tout réinitialiser ?\n\nToutes les données sauvegardées seront supprimées."
        );
        if (confirmReset) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className={styles.homePage}>
            <header className={styles.homeHeader}>
                <div className={styles.logoPlaceholder}>
                    <FontAwesomeIcon icon={faCashRegister} />
                </div>
                <h1 className={styles.homeTitle}>Bienvenue</h1>
                <p className={styles.homeSubtitle}>Choisissez votre point de vente</p>
            </header>

            <div className={styles.homeGrid}>
                {/* Note: I removed the extra 'button-wrapper' div. 
                    It's cleaner to let the grid handle the buttons directly. */}

                <HomeButton destination="daily" className={styles.homeButton}>
                    <FontAwesomeIcon icon={faUtensils} className={styles.buttonIcon} />
                    <span>Cang-tin</span>
                </HomeButton>

                <HomeButton destination="daily-new" className={styles.homeButton}>
                    <FontAwesomeIcon icon={faLeaf} className={styles.buttonIcon} />
                    <span>Cang-tin (New)</span>
                </HomeButton>

                <HomeButton destination="event" className={styles.homeButton}>
                    <FontAwesomeIcon icon={faCalendarAlt} className={styles.buttonIcon} />
                    <span>Évènements</span>
                </HomeButton>

                <HomeButton destination="vendanges" className={styles.homeButton}>
                    <FontAwesomeIcon icon={faWineGlass} className={styles.buttonIcon} />
                    <span>Vendanges</span>
                </HomeButton>

                <HomeButton destination="vendanges-new" className={styles.homeButton}>
                    <FontAwesomeIcon icon={faWineGlass} className={styles.buttonIcon} />
                    <span>Vendanges (New)</span>
                </HomeButton>
            </div>

            <footer className={styles.homeFooter}>
                <button onClick={handleResetAll} className={styles.resetButton}>
                    <FontAwesomeIcon icon={faTrashRestore} /> Réinitialiser le système
                </button>
                <span className={styles.versionText}>v1.0.0</span>
            </footer>
        </div>
    );
}

export default Home;