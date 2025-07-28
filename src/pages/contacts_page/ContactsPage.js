// Updated ContactsPage.jsx with email validation
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ContactsPage.css';
import { CenteredLayout, PartnersSection } from '../../components';
import { FaFacebook, FaInstagram, FaViber, FaTelegram } from 'react-icons/fa';

const ContactsPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (submitted) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.style.height = '100%';
      body.style.height = '100%';
    } else {
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
      html.style.height = 'auto';
      body.style.height = 'auto';
    }
    return () => {
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
      html.style.height = 'auto';
      body.style.height = 'auto';
    };
  }, [submitted]);

  const validateEmail = (value) => {
    const pattern = /.+@.+\..+/;
    setEmailValid(pattern.test(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail(email);
    if (!emailValid) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`${apiBaseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Send error');
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CenteredLayout>
      <section className={`contacts-section py-5 ${submitted ? 'content-blurred' : ''}`}>
        <Container>
          <h2 className="text-center contacts-title mb-5">Свържете се с нас</h2>
          <Row className="justify-content-center mb-5">
            <Col md={6} data-aos="fade-right">
              <div className="contact-box p-4">
                <h4 className="mb-3">Форма за запитване</h4>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Име</Form.Label>
                    <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }} isInvalid={!emailValid} required />
                    {!emailValid && <Form.Text className="text-danger">Невалиден имейл адрес</Form.Text>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Съобщение</Form.Label>
                    <Form.Control as="textarea" rows={4} value={message} onChange={e => setMessage(e.target.value)} required />
                  </Form.Group>
                  <Button variant="dark" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Изпращане...' : 'Изпрати'}
                  </Button>
                </Form>
              </div>
            </Col>

            <Col md={6} data-aos="fade-left">
              <div className="contact-box p-4">
                <h4 className="mb-3">Контакти</h4>
                <p><strong>Телефон:</strong> <a href="tel:+359876729294">+359 876 729 294</a></p>
                <div className="social-links mt-4">
                  <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                  <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                  <a href="viber://chat?number=+359876729294" target="_blank" rel="noopener noreferrer"><FaViber /></a>
                  <a href="https://t.me/yourtelegram" target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {submitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5 className="mb-3">Вашето съобщение беше изпратено успешно!</h5>
            <Button variant="dark" onClick={() => setSubmitted(false)}>Затвори</Button>
          </div>
        </div>
      )}

      <PartnersSection />
    </CenteredLayout>
  );
};

export default ContactsPage;