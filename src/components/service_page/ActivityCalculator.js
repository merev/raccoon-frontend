import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './ActivityCalculator.css';

const ActivityCalculator = ({ activities, type, subscription, selected, setSelected, onProceedCustom, customWarning }) => {
  const toggleActivity = (activity) => {
    setSelected((prev) =>
      prev.includes(activity) ? prev.filter((item) => item !== activity) : [...prev, activity]
    );
  };

  const getTotalPrice = () =>
    selected.reduce((total, name) => {
      const found = activities.find((a) => a.name === name);
      return total + (found ? found.prices[type][subscription] : 0);
    }, 0);

  return (
    <>
      <h4 className="mb-4 text-center">Или създайте своя собствен пакет</h4>
      <Form className="calculator-box p-4">
        {activities.map((activity, i) => (
          <Form.Group key={i} className="d-flex align-items-center mb-2" onClick={() => toggleActivity(activity.name)} style={{ cursor: 'pointer' }}>
            <Form.Check
              type="checkbox"
              label={`${activity.name} - ${activity.prices[type][subscription]} лв`}
              checked={selected.includes(activity.name)}
              onChange={() => toggleActivity(activity.name)}
              onClick={(e) => e.stopPropagation()}
            />
          </Form.Group>
        ))}
        <hr />
        <div className="summary-box mt-3">
          <h5>Обща цена: {getTotalPrice()} лв</h5>
          <p className="text-muted mb-0">за {type}, {subscription.toLowerCase()}</p>
        </div>
        <Button variant="success" className="mt-3" onClick={onProceedCustom}>Резервирай</Button>
        {customWarning && <p className="text-danger mt-2">Моля, изберете поне една услуга преди да продължите.</p>}
      </Form>
    </>
  );
};

export default ActivityCalculator;