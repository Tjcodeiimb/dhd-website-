import React from 'react';
import './Boy16Face.css';

export default function Boy16Face() {
  return (
    <div className="boy16-wrapper">
      <div className="boy16-hair">
        <div className="boy16-fringe1" />
        <div className="boy16-fringe2" />
        <div className="boy16-fringe3" />
        <div className="boy16-fringe4" />
      </div>
      <div className="boy16-ear-left" />
      <div className="boy16-ear-right" />
      <div className="boy16-face">
        <div className="boy16-eyebrow-left" />
        <div className="boy16-eyebrow-right" />
        <div className="boy16-eye-left">
          <div className="boy16-pupil">
            <div className="boy16-highlight" />
          </div>
        </div>
        <div className="boy16-eye-right">
          <div className="boy16-pupil">
            <div className="boy16-highlight" />
          </div>
        </div>
        <div className="boy16-nose" />
        <div className="boy16-mouth" />
      </div>
    </div>
  );
}
