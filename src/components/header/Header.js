import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Navbar variant='dark' expand="md" fixed="top" className="p-2 justify-content-center header-component">
            <Container fluid="md" className="d-flex align-items-center justify-content-between">
                {/* Logo */}
                <Navbar.Brand as={Link} to="/" className="header-logo">
                    <img src="/images/header/raccoon-logo.svg" alt="Logo" className="me-2" style={{ width: '40px', height: '40px' }}/> Raccoon
                </Navbar.Brand>

                {/* Toggle for Mobile View */}
                <Navbar.Toggle aria-controls="navbar-nav" />

                <Navbar.Collapse id="navbar-nav">

                    <Nav className="me-auto d-flex align-items-center header-nav">
                        <Nav.Link as={Link} to="/" className={`header-element ${currentPath === '/' ? 'active-link' : ''}`}>
                            Начало
                        </Nav.Link>
                        <Nav.Link as={Link} to="/services" className={`header-element ${currentPath.startsWith('/services') ? 'active-link' : ''}`}>
                            Услуги
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contacts" className={`header-element ${currentPath === '/contacts' ? 'active-link' : ''}`}>
                            Контакти
                        </Nav.Link>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;