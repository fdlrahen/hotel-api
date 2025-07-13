import React from 'react';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegramPlane, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Pastikan path ini sesuai dengan struktur proyekmu
import sharedStyles from '../../css/footer.css';

const Footer = () => {
    return (
        <footer className={sharedStyles.footer}>
            <div className="container">
                <div className="row mb-5"> 

                    <div className="col-md-2 offset-md-1 col-6 text-center text-md-start">
                        <h5>Reservation</h5>
                        <ul className="list-unstyled">
                            <li><a href="/reservation/modify-cancel">Modify / Cancel</a></li>
                            <li><a href="/reservation/hotel-bill">Hotel Bill</a></li>
                        </ul>
                    </div>

                    <div className="col-md-2 col-6 text-center text-md-start">
                        <h5>Customer Service</h5>
                        <ul className="list-unstyled">
                            <li><a href="/customer-service/faq">FAQ</a></li>
                            <li><a href="/customer-service/contact-us">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3 text-center text-md-start">
                        <h5>Connect With Us</h5>
                        <p className="mb-3">
                            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                            Email: <strong>hotel@aplikasihotel.com</strong>
                        </p>
                        <div className={sharedStyles.footerSocialIcons}>
                            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <FontAwesomeIcon icon={faWhatsapp} />
                            </a>
                            <a href="https://t.me/yourtelegramusername" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <FontAwesomeIcon icon={faTelegramPlane} />
                            </a>
                            <a href="https://www.instagram.com/yourinstagramhandle" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="mailto:hotel@aplikasihotel.com" aria-label="Email">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`col-12 text-center ${sharedStyles.footerCopyright}`}>
                        <p>&copy; 2025 Hotel App. Hak Cipta Dilindungi.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;