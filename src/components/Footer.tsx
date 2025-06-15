import './Footer.css';
import LanguageButtons from './LanguageButtons';

export default function Footer() {
      return (
    <footer className="app-footer">
      <div className="footer-content">
        <span className="footer-text">Firestone Manager v0.1 &copy; XenobiaMegami</span>
        <div>
            <LanguageButtons />
        </div>
      </div>
    </footer>
  );
}