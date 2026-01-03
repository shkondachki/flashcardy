import styles from "../components/Header.module.scss";
import {useEffect, useState, useRef} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { LogIn, LogOut, BookOpenText, BookCopy, CopyPlus } from 'lucide-react';
import {useApp} from "../context/AppContext";

interface HeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

export function Header({
    isAuthenticated,
    onLogout
}: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const {setShowCreateForm} = useApp();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLElement>(null);

    // Helper to close mobile menu
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Handle whether it's scrolled so we know if menu is sticky
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);
    
    // Close mobile menu when clicking outside
    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const isClickInsideMenu = menuRef.current?.contains(target);
            const isClickOnHamburger = hamburgerButtonRef.current?.contains(target);
            
            if (!isClickInsideMenu && !isClickOnHamburger) {
                closeMobileMenu();
            }
        }

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on Escape key
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);

    // Navigation handlers
    const handleStudyMode = () => navigate('/study-mode');
    
    const handleCreateFlashcard = () => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => setShowCreateForm(true), 100);
        } else {
            setShowCreateForm(true);
        }
        closeMobileMenu();
    };

    const handleLogout = () => {
        onLogout();
        closeMobileMenu();
    };

    return (
        <>
            <div className={`${styles.pageHeader} ${isScrolled ? styles.sticky : ''}`}>
                <div className={styles.container}>
                    <div className={styles.logoSection}>
                        <h1 className={styles.logo}><Link to="/">Flashcardy</Link></h1>

                        {/* Desktop Documentation Link */}
                        <div className="desktopOnly">
                            <div className={styles.headerActions}>
                                <Link to="/documentation" className={`btn-icon ${styles.menuLink}`}>
                                    <BookOpenText size={18}/>
                                    Documentation
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Desktop Actions */}
                    <div className="desktopOnly">
                        <div className={`${styles.headerActions}`}>
                            <button
                                onClick={handleStudyMode}
                                className="btn-outline-primary btn-icon"
                            >
                                <BookCopy strokeWidth={1.8} size={18}/>
                                Study Mode
                            </button>
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleCreateFlashcard}
                                        className="btn-primary btn-icon"
                                    >
                                        <CopyPlus strokeWidth={2} size={18}/>
                                        Create Flashcard
                                    </button>
                                    <button onClick={handleLogout} className="btn-outline-secondary btn-icon">
                                        <LogOut size={18}/>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="btn-outline-primary btn-icon">
                                    <LogIn size={18}/>
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>


                    {/* Mobile Actions (Study Mode + Hamburger) */}
                    <div className={styles.mobileActions}>
                        <button
                            onClick={handleStudyMode}
                            className={`btn-outline-primary btn-icon ${styles.mobileStudyButton}`}
                        >
                            <BookCopy strokeWidth={1.8} size={18}/>
                            Study Mode
                        </button>
                        <button
                            ref={hamburgerButtonRef}
                            className={`${styles.hamburgerButton} ${isMobileMenuOpen ? styles.open : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className={styles.hamburgerIcon}></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
                aria-hidden={!isMobileMenuOpen}
            >
                <nav className={styles.mobileMenu} ref={menuRef}>
                    <Link 
                        to="/documentation" 
                        className={`btn-icon ${styles.menuLink} ${styles.mobileMenuItem}`}
                        onClick={closeMobileMenu}
                    >
                        <BookOpenText size={20}/>
                        Documentation
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <button 
                                onClick={handleCreateFlashcard} 
                                className={`btn-primary btn-icon ${styles.mobileMenuItem}`}
                            >
                                <CopyPlus strokeWidth={2} size={20}/>
                                Create Flashcard
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className={`btn-outline-secondary btn-icon ${styles.mobileMenuItem}`}
                            >
                                <LogOut size={20}/>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login" 
                            className={`btn-outline-primary btn-icon ${styles.mobileMenuItem}`}
                            onClick={closeMobileMenu}
                        >
                            <LogIn size={20}/>
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
}