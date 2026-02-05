import React from 'react';
import Container from './Container';

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const Section = ({ id, title, subtitle, actions, children }: SectionProps) => {
  return (
    <section id={id} className="section">
      <Container>
        <div className="section-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="section-actions">{actions}</div>}
        </div>
        {children}
      </Container>
    </section>
  );
};

export default Section;
