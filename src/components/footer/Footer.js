import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3">
            <Container>
                <p className="mb-0">&copy; {new Date().getFullYear()} Ракун ЕООД. Всички права запазени.</p>
            </Container>
        </footer>
    );
};

export default Footer;
