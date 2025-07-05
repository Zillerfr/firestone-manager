import { Link } from 'react-router-dom';
import './Footer.css';
import LanguageButtons from './LanguageButtons';

export default function Footer() {
      return (
    <footer className="app-footer">
      <div className="footer-content">
        <span className="footer-text">Firestone Manager v0.1 &copy; XenobiaMegami</span>
				<div className="footer-action">
					<Link to="/data-management" className="footer-link">
						Import / Export
					</Link>
					<div>
						<LanguageButtons />
					</div>
				</div>
      </div>
    </footer>
  );
}