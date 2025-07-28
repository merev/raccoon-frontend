import React from 'react';
import { Container } from 'react-bootstrap';
import { Header, Footer } from '../'; // refers to components/index.js
import './CenteredLayout.css';

const CenteredLayout = ({ children }) => {
  return (
    <div className="aos-wrapper">
      <Header />

      <Container
        fluid
        className="d-flex justify-content-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="w-100 w-md-75 w-lg-50">
          {children}
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default CenteredLayout;
