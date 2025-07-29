import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ServicePage.css';

import { CenteredLayout, PartnersSection, PlanSelector, ActivityCalculator, ReservationModal } from '../../components';

import {
  entranceTypes,
  subscriptionTypes,
  plans,
  activities
} from '../../data/entrances_page/entrancesServiceData';

const EntrancesPage = () => {
  const [selected, setSelected] = useState([]);
  const [selectedEntranceType, setSelectedEntranceType] = useState(entranceTypes[0]);
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
    return () => body.classList.remove('modal-open');
  }, [step]);

  const getTotalPrice = () =>
    selected.reduce((total, name) => {
      const found = activities.find((a) => a.name === name);
      return total + (found ? found.prices[selectedEntranceType][subscriptionType] : 0);
    }, 0);

  const resetState = () => {
    setStep('main');
    setUserData({ name: '', email: '', phone: '', address: '', info: '', date: '', time: '' });
    setSelected([]);
    setSelectedPlan(null);
    setShowValidation(false);
  };

  return (
    <CenteredLayout>
      <section className="service-detail-section py-5 position-relative">
        <Container className={step !== 'main' ? 'content-blurred' : ''}>
          <h2 className="text-center mb-4 service-title">Почистване на входове</h2>

          {/* Entrance Type Selector */}
          <Row className="mb-3 justify-content-center" data-aos="fade-right">
            <Col md={6}>
              <Form.Group controlId="entranceTypeSelect">
                <Form.Label><strong>Брой етажи/апартаменти:</strong></Form.Label>
                <Form.Select
                  value={selectedEntranceType}
                  onChange={(e) => setSelectedEntranceType(e.target.value)}
                >
                  {entranceTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Subscription Selector */}
          <Row className="mb-4 justify-content-center" data-aos="fade-left">
            <Col md={6}>
              <Form.Group controlId="subscriptionSelect">
                <Form.Label><strong>Тип на обслужване:</strong></Form.Label>
                <Form.Select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                >
                  {subscriptionTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Plan Selector */}
          <PlanSelector
            plans={plans}
            type={selectedEntranceType}
            subscription={subscriptionType}
            onSelect={(plan) => {
              setSelectedPlan(plan);
              setStep('form');
            }}
          />

          {/* Activity Calculator */}
          <Row data-aos="fade-left">
            <Col md={8} className="mx-auto">
              <ActivityCalculator
                activities={activities}
                type={selectedEntranceType}
                subscription={subscriptionType}
                selected={selected}
                setSelected={setSelected}
                onProceedCustom={() => {
                  if (selected.length === 0) {
                    setCustomWarning(true);
                    return;
                  }
                  setCustomWarning(false);
                  setSelectedPlan('custom');
                  setStep('form');
                }}
                customWarning={customWarning}
              />
            </Col>
          </Row>
        </Container>

        {/* Modal with form/confirm/success steps */}
        <ReservationModal
          step={step}
          setStep={setStep}
          userData={userData}
          setUserData={setUserData}
          selected={selected}
          selectedType={selectedEntranceType}
          subscriptionType={subscriptionType}
          selectedPlan={selectedPlan}
          activities={activities}
          totalPrice={getTotalPrice()}
          serviceType="entrances"
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          showValidation={showValidation}
          setShowValidation={setShowValidation}
          emailValid={emailValid}
          setEmailValid={setEmailValid}
          phoneValid={phoneValid}
          setPhoneValid={setPhoneValid}
          apiBaseUrl={apiBaseUrl}
          resetState={resetState}
        />
      </section>
      <PartnersSection />
    </CenteredLayout>
  );
};

export default EntrancesPage;
