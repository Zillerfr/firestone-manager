import { HashRouter as Router } from 'react-router-dom';
import { useEffect } from 'react'; // Importez useEffect
import { useDispatch } from 'react-redux'; // Importez useDispatch
import './App.css';
import Navigator from './app/Navigator';
import Footer from './components/Footer';
import Header from './components/Header';
import { fetchHeroes } from './store/heroesSlice';


function App() {
    const dispatch = useDispatch();

    // Utilisez useEffect pour déclencher le chargement une seule fois au montage du composant
    useEffect(() => {
        // Dispatch l'action asynchrone pour charger les héros
        dispatch(fetchHeroes() as any); // Le 'as any' est souvent nécessaire pour les thunks avec TypeScript
    }, [dispatch]); // Le tableau de dépendances vide [] garantit que cela ne s'exécute qu'une fois au montage.
                    // Si vous avez un linter ESLint, il pourrait suggérer d'ajouter 'dispatch', ce qui est correct.

    return (
        <Router>
            <Header />
            <Navigator />
            <Footer />
        </Router>
    );
}

export default App;