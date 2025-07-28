import React from 'react';
import { Container, Row } from 'react-bootstrap';
import 'aos/dist/aos.css';
import './PartnersSection.css';

const PartnersSection = () => {
  return (
    <section className="partners-section text-center py-5">
      <Container>
        <h2 className="mb-4 partners-title">Нашите партньори</h2>
        <Row className="justify-content-center align-items-center">
          <div
            className="col-6 col-md-4 mb-4 d-flex justify-content-center"
            data-aos="fade-right"
            data-aos-offset="200"
            data-aos-duration="1000"
          >
            <a href="https://www.kaercher.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/partners/karcher-logo.png"
                alt="Kärcher Logo"
                className="partner-logo"
              />
            </a>
          </div>
          <div
            className="col-6 col-md-4 mb-4 d-flex justify-content-center"
            data-aos="fade-left"
            data-aos-offset="200"
            data-aos-duration="1000"
          >
            <a href="https://www.koch-chemie.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/partners/koch-chemie-logo.webp"
                alt="Koch Chemie Logo"
                className="partner-logo"
              />
            </a>
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default PartnersSection;
