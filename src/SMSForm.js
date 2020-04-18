import React, { useState } from 'react';
import { Button } from 'reactstrap';
import './SMSForm.css';

const SMSForm = () => {
  const [message, setMessage] = useState({
    to: '',
    body: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!message.to) {
      setError('Target Phone number is missing.');
    } else if (!message.body) {
      setError('Message body is empty.');
    } else {
      return true;
    }

    return false;
  };

  const onSubmit = event => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setError('');
    setSubmitting(true);
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setError('');
          setSubmitting(false);
          setMessage({
            to: '',
            body: ''
          });
        } else {
          setError(data.message);
          setSubmitting(false);
        }
      });
  };

  const onHandleChange = event => {
    const name = event.target.getAttribute('name');
    setMessage({ ...message, [name]: event.target.value });
    setError('');
  };

  return (
    <form onSubmit={onSubmit} className={'sms-form'}>
      <div>
        <label htmlFor="to">To:</label>
        <input
          type="tel"
          name="to"
          id="to"
          value={message.to}
          onChange={onHandleChange}
        />
      </div>
      <div>
        <label htmlFor="body">Body:</label>
        <textarea
          name="body"
          id="body"
          value={message.body}
          onChange={onHandleChange}
        />
      </div>
      {error && (
        <div>
          <span>{error}</span>
        </div>
      )}
      <Button type="submit" color="primary" disabled={submitting}>
        Send message
      </Button>
    </form>
  );
};

export default SMSForm;
