import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FooterCredits() {
  const creators = [
    'Vaishnavi Singh',
    'Vishakha Singh',
    'Vaishali Pandey',
    'Vaishnavi'
  ];

  return (
    <footer className="cafe-credits-footer no-print">
      <div className="credits-inner">
        <div className="credits-crest">
          <span className="crest-monogram">HC</span>
          <div className="crest-line"></div>
        </div>

        <div className="credits-brand-group">
          <h4 className="credits-brand-name">HOGWARTS CAFE</h4>
          <p className="credits-brand-subtitle">A LITTLE MAGIC IN EVERY SERVING.</p>
        </div>

        <div className="brass-divider"></div>

        <div className="credits-curators-box">
          <p className="credits-title">THE MINDS BEHIND HOGWARTS CAFE</p>
          <div className="creators-list">
            {creators.map((name, idx) => (
              <span key={idx} className="creator-badge">
                <span className="creator-bullet">✦</span>
                <span className="creator-name">{name}</span>
              </span>
            ))}
          </div>
          <p className="credits-quote">
            “Designed with care, served with a little magic.”
          </p>
        </div>

        <div className="credits-bottom-bar">
          <small>© {new Date().getFullYear()} Hogwarts Cafe — Heritage Hospitality & POS Systems. All Rights Reserved.</small>
        </div>
      </div>
    </footer>
  );
}
