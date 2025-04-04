import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ConfirmationPopup.css'; // Optional custom styles

const ConfirmationPopup = ({ message, onClose, isError }) => {
  return (
    <div className="confirmation-popup-overlay">
      <div className={`confirmation-popup ${isError ? 'error' : ''}`}>
        <div className="popup-header">
          <h5 className="modal-title">{isError ? 'Error' : 'Success'}</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="popup-body">
          <p>{message}</p>
        </div>
        <div className="popup-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;