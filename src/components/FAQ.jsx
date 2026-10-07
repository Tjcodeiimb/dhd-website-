import React from 'react';

export default function FAQ() {
  return (
    <div className="frame" id="faq">
      <span className="tag">Home · 10 · FAQ</span>
      <h2 style={{ fontSize: '28px', marginBottom: '14px' }}>Questions people actually ask.</h2>
      <details>
        <summary>Who can apply?</summary>
        <p>Anyone from 16 to 45. Student, employee, in-between. We select on hunger, not marks. This is an application, not a checkout.</p>
      </details>
      <details>
        <summary>I don't have a business idea. Is that a problem?</summary>
        <p>No. The tracks exist so you don't need one. You need the willingness to talk to strangers and ask for money.</p>
      </details>
      <details>
        <summary>How much money do I need to start?</summary>
        <p>SevaDaata: ₹0. Karkhana: a few thousand rupees, and the playbook makes your customers fund most of it through pre-orders.</p>
      </details>
      <details>
        <summary>How much time does it take?</summary>
        <p>Around 10 hours a week. 2-3 live sessions, the rest is fieldwork. The fieldwork is the course.</p>
      </details>
      <details>
        <summary>What if I miss a live session?</summary>
        <p>Recordings exist so you can revise, not so you can skip. Checkpoints don't move.</p>
      </details>
      <details>
        <summary>How is the Bangalore team picked?</summary>
        <p>We evaluate teams throughout the cohort and select the finalists. The cohort watches, we decide, and we explain the choice publicly.</p>
      </details>
      <details>
        <summary>Do I get a certificate?</summary>
        <p>You get a P&amp;L with your name on it. It says more.</p>
      </details>
    </div>
  );
}
