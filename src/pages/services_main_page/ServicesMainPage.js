import { useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ServicesMainPage.css';
import { CenteredLayout, PartnersSection } from '../../components';
import { services } from '../../data';

const ServicesPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <CenteredLayout>
      <section className="services-page py-5">
        <Container>
          <h2 className="text-center services-title mb-5">Нашите услуги</h2>
          <Row className="justify-content-center">
            {services.map((service, index) => (
              <div
                key={index}
                className="col-12 col-md-6 col-lg-4 mb-5 d-flex justify-content-center"
                data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
              >
                <Link to={service.link} className="text-decoration-none">
                  <div className="service-card">
                    <img
                      src={`/images/homepage/${service.img}`}
                      alt={service.title}
                      className="service-img"
                    />
                    <div className="service-body">
                      <h4 className="service-title mb-3">{service.title}</h4>
                      <ul className="service-points text-start">
                        {service.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Row>
        </Container>
      </section>
      <PartnersSection />
    </CenteredLayout>
  );
};

export default ServicesPage;
