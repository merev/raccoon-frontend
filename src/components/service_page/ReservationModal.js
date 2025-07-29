// 📁 src/components/ServicePage/ReservationModal.jsx
import React from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import './ReservationModal.css';

const ReservationModal = ({
  step,
  setStep,
  userData,
  setUserData,
  selected,
  selectedType,
  subscriptionType,
  selectedPlan,
  activities,
  totalPrice,
  serviceType,
  isSubmitting,
  setIsSubmitting,
  showValidation,
  setShowValidation,
  emailValid,
  setEmailValid,
  phoneValid,
  setPhoneValid,
  apiBaseUrl,
  resetState
}) => {

  const isFormValid = () => {
    const emailPattern = /.+@.+\..+/;
    const phonePattern = /^\d{10}$/;
    const emailCheck = emailPattern.test(userData.email);
    const phoneCheck = phonePattern.test(userData.phone);
    setEmailValid(emailCheck);
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...userData,
        flat_type: selectedType,
        subscription: subscriptionType,
        plan: selectedPlan === 'custom' ? null : selectedPlan.name,
        activities: selectedPlan === 'custom' ? selected : [],
        total_price: selectedPlan === 'custom' ? totalPrice : selectedPlan.prices[selectedType][subscriptionType],
        service_type: serviceType
      };

      const res = await fetch(`${apiBaseUrl}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('API error');
      await res.json();
      setStep('success');
    } catch (err) {
      alert('Възникна грешка при изпращането на заявката.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!['form', 'confirm', 'success'].includes(step)) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
            <p><strong>Тип:</strong> {selectedType}</p>
            <p><strong>Тип обслужване:</strong> {subscriptionType}</p>
            {selectedPlan === 'custom' ? (
              <>
                <p><strong>Избрани услуги:</strong></p>
                <ul>
                  {selected.map((name, i) => (
                    <li key={i}>{name} — {activities.find(a => a.name === name)?.prices[selectedType][subscriptionType]} лв</li>
                  ))}
                </ul>
                <p><strong>Обща цена:</strong> {totalPrice} лв</p>
              </>
            ) : (
              <>
                <p><strong>План:</strong> {selectedPlan.name}</p>
                <p><strong>Цена:</strong> {selectedPlan.prices[selectedType][subscriptionType]} лв</p>
              </>
            )}
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => setStep('form')}>Назад</Button>
              <Button variant="success" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? (<Spinner animation="border" size="sm" />) : 'Потвърди'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div>
            <h4 className="mb-4 text-success">Заявката е изпратена успешно!</h4>
            <p>Благодарим ви, {userData.name}. Ще получите потвърждение по имейл на <strong>{userData.email}</strong>.</p>
            <div className="text-center mt-4">
              <Button variant="dark" onClick={resetState}>Затвори</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;
