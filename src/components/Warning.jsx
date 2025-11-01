import React from 'react';
import '../styles/Warning.css'; // Make sure to style it

const Warning = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="warning-overlay" onClick={onClose}>
      <div className="warning-content" onClick={(e) => e.stopPropagation()}>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className="warning-actions">
          <button className="primary-btn" onClick={onClose}>Cancel</button>
          <button className="secondary-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
