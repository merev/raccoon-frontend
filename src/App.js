import { React, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { ScrollToTop } from './components';
import { HomePage, ServicesMainPage, FlatsPage, HousesPage, OfficesPage, CarsPage, EntrancesPage, BackyardsPage, ContactsPage } from './pages';
import './App.css';

function Layout() {
    // const location = useLocation();

    // // Check if the current path starts with "/docs"
    // const showSidebar = location.pathname.startsWith('/docs');

    return (
        <div>
            {/* <Header /> */}
            <Container fluid className='home-page'>
                <Row>
                   <Routes>
                            <Route exact path="/" element={<HomePage />} />
                            <Route exact path="/services" element={<ServicesMainPage />} />
                            <Route exact path="/contacts" element={<ContactsPage />} />
                            <Route exact path="/services/flats" element={<FlatsPage />} />
                            <Route exact path="/services/houses" element={<HousesPage />} />
                            <Route exact path="/services/offices" element={<OfficesPage />} />
                            <Route exact path="/services/cars" element={<CarsPage />} />
                            <Route exact path="/services/entrances" element={<EntrancesPage />} />
                            <Route exact path="/services/backyards" element={<BackyardsPage />} />
                            {/* Add more routes as needed */}
                  </Routes>
                </Row>
            </Container>
        </div>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Layout />
        </Router>
    );
}

export default App;