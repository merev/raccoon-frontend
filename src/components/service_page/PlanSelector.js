import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './PlanSelector.css';

const PlanSelector = ({ plans, type, subscription, onSelect }) => (
  <Row className="mb-5" data-aos="fade-right">
    <h4 className="mb-4 text-center">Нашите планове</h4>
    {plans.map((plan, i) => (
      <Col key={i} md={4} className="mb-4 d-flex">
        <Card className="plan-card text-center w-100 d-flex flex-column">
          <Card.Body className="d-flex flex-column">
            <Card.Title>{plan.name}</Card.Title>
            <h3 className="my-3">{plan.prices[type][subscription]} лв</h3>
            <small className="text-muted mb-3">за {type}, {subscription.toLowerCase()}</small>
            <ul className="list-unstyled flex-grow-1">
              {plan.features.map((f, idx) => <li key={idx}>• {f}</li>)}
            </ul>
            <Button variant="dark" className="mt-auto" onClick={() => onSelect(plan)}>Избери</Button>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default PlanSelector;