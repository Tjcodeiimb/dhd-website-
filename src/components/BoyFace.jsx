import React from 'react';
import './BoyFace.css';

export default function BoyFace({ glasses = false, expression = 'smile', beard = false }) {
  return (
    <div className="boy-face-wrapper">
      <div className="boy-face-hair">
        <div className="boy-face-fringe1" />
        <div className="boy-face-fringe2" />
        <div className="boy-face-fringe3" />
        <div className="boy-face-fringe4" />
      </div>
      <div className="boy-face-ear-left" />
      <div className="boy-face-ear-right" />
      <div className="boy-face-main">
        <div className="boy-face-eyebrow-left" />
        <div className="boy-face-eyebrow-right" />
        <div className="boy-face-eye-left">
          <div className="boy-face-pupil">
            <div className="boy-face-highlight" />
          </div>
        </div>
        <div className="boy-face-eye-right">
          <div className="boy-face-pupil">
            <div className="boy-face-highlight" />
          </div>
        </div>
        
        {glasses && (
          <div className="boy-face-glasses">
            <div className="boy-face-glass-left" />
            <div className="boy-face-glass-bridge" />
            <div className="boy-face-glass-right" />
          </div>
        )}

        <div className="boy-face-nose" />
        
        <div className={`boy-face-mouth boy-face-mouth-${expression}`} />
        
        {beard && (
          <div className="boy-face-beard">
            <div className="stubble s1" />
            <div className="stubble s2" />
            <div className="stubble s3" />
            <div className="stubble s4" />
            <div className="stubble s5" />
            <div className="stubble s6" />
            <div className="stubble s7" />
            <div className="stubble s8" />
          </div>
        )}
      </div>
    </div>
  );
}
