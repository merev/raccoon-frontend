import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './FlatsPage.css'; // Reuse FlatsPage.css for shared styles
import { CenteredLayout, PartnersSection } from '../../components';
import {
  officeTypes,
  subscriptionTypes,
  plans,
  activities
} from '../../data/offices_page/officesServiceData';

const OfficesPage = () => {
  const [selected, setSelected] = useState([]);
  const [selectedOfficeType, setSelectedOfficeType] = useState(officeTypes[0]);
  const [subscriptionType, setSubscriptionType] = useState(subscriptionTypes[0]);
  const [step, setStep] = useState('main');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    info: '',
    date: '',
    time: ''
  });
  const [showValidation, setShowValidation] = useState(false);
  const [customWarning, setCustomWarning] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  useEffect(() => {
    const body = document.body;
    if (['form', 'confirm', 'success'].includes(step)) {
      body.classList.add('modal-open');
    } else {
      body.classList.remove('modal-open');
    }
    return () => {
      body.classList.remove('modal-open');
    };
  }, [step]);

  const toggleActivity = (activity) => {
    setSelected((prev) =>
      prev.includes(activity) ? prev.filter((item) => item !== activity) : [...prev, activity]
    );
  };

  const getTotalPrice = () =>
    selected.reduce((total, name) => {
      const found = activities.find((a) => a.name === name);
      return total + (found ? found.prices[selectedOfficeType][subscriptionType] : 0);
    }, 0);

  const isFormValid = () => {
    const emailPattern = /.+@.+\..+/;
    const emailCheck = emailPattern.test(userData.email);
    setEmailValid(emailCheck);

    const phonePattern = /^\d{10}$/;
    const phoneCheck = phonePattern.test(userData.phone);
    setPhoneValid(phoneCheck);

    return (
      userData.name.trim() &&
      userData.email.trim() &&
      userData.phone.trim() &&
      userData.address.trim() &&
      userData.date &&
      userData.time &&
      emailCheck &&
      phoneCheck
    );
  };

  return (
    <CenteredLayout>
      <section className="service-detail-section py-5 position-relative">
        <Container className={step !== 'main' ? 'content-blurred' : ''}>
          <h2 className="text-center mb-4 service-title">Почистване на офиси</h2>

          <Row className="mb-3 justify-content-center" data-aos="fade-right">
            <Col md={6}>
              <Form.Group controlId="officeTypeSelect">
                <Form.Label><strong>Тип на офиса:</strong></Form.Label>
                <Form.Select
                  value={selectedOfficeType}
                  onChange={(e) => setSelectedOfficeType(e.target.value)}>
                  {officeTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4 justify-content-center" data-aos="fade-left">
            <Col md={6}>
              <Form.Group controlId="subscriptionSelect">
                <Form.Label><strong>Тип на обслужване:</strong></Form.Label>
                <Form.Select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}>
                  {subscriptionTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-5" data-aos="fade-right">
            <h4 className="mb-4 text-center">Нашите планове</h4>
            {plans.map((plan, i) => (
              <Col key={i} md={4} className="mb-4 d-flex">
                <Card className="plan-card text-center w-100 d-flex flex-column">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{plan.name}</Card.Title>
                    <h3 className="my-3">{plan.prices[selectedOfficeType][subscriptionType]} лв</h3>
                    <small className="text-muted mb-3">за {selectedOfficeType}, {subscriptionType.toLowerCase()}</small>
                    <ul className="list-unstyled flex-grow-1">
                      {plan.features.map((f, idx) => <li key={idx}>• {f}</li>)}
                    </ul>
                    <Button variant="dark" className="mt-auto" onClick={() => {
                      setSelectedPlan(plan);
                      setStep('form');
                    }}>Избери</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row data-aos="fade-left">
            <h4 className="mb-4 text-center">Или създайте своя собствен пакет</h4>
            <Col md={8} className="mx-auto">
              <Form className="calculator-box p-4">
                {activities.map((activity, i) => (
                  <Form.Group key={i} className="d-flex align-items-center mb-2" onClick={() => toggleActivity(activity.name)} style={{ cursor: 'pointer' }}>
                    <Form.Check
                      type="checkbox"
                      label={`${activity.name} - ${activity.prices[selectedOfficeType][subscriptionType]} лв`}
                      checked={selected.includes(activity.name)}
                      onChange={() => toggleActivity(activity.name)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Form.Group>
                ))}
                <hr />
                <div className="summary-box mt-3">
                  <h5>Обща цена: {getTotalPrice()} лв</h5>
                  <p className="text-muted mb-0">за {selectedOfficeType}, {subscriptionType.toLowerCase()}</p>
                </div>
                <Button variant="success" className="mt-3" onClick={() => {
                  if (selected.length === 0) {
                    setCustomWarning(true);
                    return;
                  }
                  setCustomWarning(false);
                  setSelectedPlan('custom');
                  setStep('form');
                }}>Резервирай</Button>
                {customWarning && <p className="text-danger mt-2">Моля, изберете поне една услуга преди да продължите.</p>}
              </Form>
            </Col>
          </Row>
        </Container>

        {/* Modal Logic: identical to flats, just reusing fields and updating plan info */}
        {(step === 'form' || step === 'confirm' || step === 'success') && (
          <div className="modal-overlay">
            <div className="modal-content">
              {/* Form Step */}
              {step === 'form' && (
                <Form>
                  <h4 className="mb-4">Вашите данни</h4>
                  {['name', 'email', 'phone', 'address'].map((field, i) => (
                    <Form.Group key={i} className="mb-3">
                      <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)} *</Form.Label>
                      <Form.Control
                        type={field === 'email' ? 'email' : 'text'}
                        value={userData[field]}
                        onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                        isInvalid={
                          showValidation &&
                          (userData[field].trim() === '' ||
                            (field === 'email' && !emailValid) ||
                            (field === 'phone' && !phoneValid))
                        }
                      />
                      {showValidation && userData[field].trim() === '' && (
                        <Form.Control.Feedback type="invalid">Полето е задължително</Form.Control.Feedback>
                      )}
                      {showValidation && field === 'email' && userData.email.trim() !== '' && !emailValid && (
                        <Form.Text className="text-danger">Невалиден имейл адрес</Form.Text>
                      )}
                      {showValidation && field === 'phone' && userData.phone.trim() !== '' && !phoneValid && (
                        <Form.Text className="text-danger">Телефонният номер трябва да съдържа точно 10 цифри</Form.Text>
                      )}
                    </Form.Group>
                  ))}
                  <Form.Group className="mb-3">
                    <Form.Label>Желана дата *</Form.Label>
                    <Form.Control
                      type="date"
                      value={userData.date || ''}
                      onChange={(e) => setUserData({ ...userData, date: e.target.value })}
                      isInvalid={showValidation && !userData.date}
                    />
                    <Form.Control.Feedback type="invalid">Полето е задължително</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Час *</Form.Label>
                    <Form.Control
                      type="time"
                      value={userData.time || ''}
                      onChange={(e) => setUserData({ ...userData, time: e.target.value })}
                      isInvalid={showValidation && !userData.time}
                    />
                    <Form.Control.Feedback type="invalid">Полето е задължително</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Допълнителна информация</Form.Label>
                    <Form.Control as="textarea" rows={3} value={userData.info} onChange={(e) => setUserData({ ...userData, info: e.target.value })} />
                  </Form.Group>
                  <div className="buttons-container">
                    <Button variant="secondary" onClick={() => setStep('main')}>Назад</Button>
                    <Button variant="success" onClick={() => {
                      setShowValidation(true);
                      if (isFormValid()) setStep('confirm');
                    }}>Напред</Button>
                  </div>
                </Form>
              )}

              {/* Confirm Step */}
              {step === 'confirm' && (
                <div>
                  <h4 className="mb-4">Потвърждение на заявката</h4>
                  <p><strong>Име:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Телефон:</strong> {userData.phone}</p>
                  <p><strong>Адрес:</strong> {userData.address}</p>
                  <p><strong>Дата:</strong> {userData.date}</p>
                  <p><strong>Час:</strong> {userData.time}</p>
                  <p><strong>Инфо:</strong> {userData.info || 'Няма'}</p>
                  <p><strong>Тип на офиса:</strong> {selectedOfficeType}</p>
                  <p><strong>Тип обслужване:</strong> {subscriptionType}</p>
                  {selectedPlan === 'custom' ? (
                    <>
                      <p><strong>Избрани услуги:</strong></p>
                      <ul>
                        {selected.map((name, i) => (
                          <li key={i}>{name} — {activities.find(a => a.name === name)?.prices[selectedOfficeType][subscriptionType]} лв</li>
                        ))}
                      </ul>
                      <p><strong>Обща цена:</strong> {getTotalPrice()} лв</p>
                    </>
                  ) : (
                    <>
                      <p><strong>План:</strong> {selectedPlan.name}</p>
                      <p><strong>Цена:</strong> {selectedPlan.prices[selectedOfficeType][subscriptionType]} лв</p>
                    </>
                  )}
                  <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={() => setStep('form')}>Назад</Button>
                    <Button
                      variant="success"
                      disabled={isSubmitting}
                      onClick={async () => {
                        try {
                          setIsSubmitting(true);
                          const payload = {
                            ...userData,
                            flat_type: selectedOfficeType,
                            subscription: subscriptionType,
                            plan: selectedPlan === 'custom' ? null : selectedPlan.name,
                            activities: selectedPlan === 'custom' ? selected : [],
                            total_price: selectedPlan === 'custom'
                              ? getTotalPrice()
                              : selectedPlan.prices[selectedOfficeType][subscriptionType],
                          };
                          const res = await fetch(`${apiBaseUrl}/reservations`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                            },
                            body: JSON.stringify(payload),
                          });
                          if (!res.ok) throw new Error('API error');
                          const data = await res.json();
                          console.log('Reservation successful:', data);
                          setStep('success');
                        } catch (error) {
                          alert('Възникна грешка при изпращането на заявката.');
                          console.error(error);
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}>
                      {isSubmitting ? (<Spinner animation="border" size="sm" />) : 'Потвърди'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <div>
                  <h4 className="mb-4 text-success">Заявката е изпратена успешно!</h4>
                  <p>Благодарим ви, {userData.name}. Ще получите потвърждение по имейл на <strong>{userData.email}</strong>.</p>
                  <div className="text-center mt-4">
                    <Button variant="dark" onClick={() => {
                      setStep('main');
                      setUserData({ name: '', email: '', phone: '', address: '', info: '', date: '', time: '' });
                      setSelected([]);
                      setSelectedPlan(null);
                      setShowValidation(false);
                    }}>
                      Затвори
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      <PartnersSection />
    </CenteredLayout>
  );
};

export default OfficesPage;
