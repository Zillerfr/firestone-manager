import { HashRouter as Router } from 'react-router-dom';
import './App.css';
import Navigator from './app/Navigator';
import Footer from './components/Footer';
import Header from './components/Header';

function App() {
	return (
		<Router>
			<Header />
      <Navigator />
			<Footer />
		</Router>
	);
}

export default App;
