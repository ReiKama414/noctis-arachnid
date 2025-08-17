import React from 'react';
import { ComponentId } from '../types/spider';
import { COMPONENT_METADATA } from '../geometry/buildNoctisArachnid';

interface ComponentInspectorModalProps {
  selectedComponent: ComponentId | null;
  isolatedComponent: ComponentId | null;
  onToggleIsolate: (id: ComponentId) => void;
  onClose: () => void;
}

export const ComponentInspectorModal: React.FC<ComponentInspectorModalProps> = ({
  selectedComponent,
  isolatedComponent,
  onToggleIsolate,
  onClose,
}) => {
  if (!selectedComponent) return null;
  const meta = COMPONENT_METADATA[selectedComponent];
  const isIsolated = isolatedComponent === selectedComponent;

  return (
    <div className="component-inspector-card" role="dialog" aria-label={meta.name}>
      <div className="inspector-header">
        <div>
          <div className="inspector-code">{meta.code}</div>
          <h3 className="inspector-title">{meta.name}</h3>
        </div>
        <button type="button" className="inspector-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <p className="inspector-description">{meta.description}</p>

      <div className="inspector-meta-grid">
        <div>
          <span className="meta-label">FUNCTION</span>
          <span className="meta-val">{meta.mechanicalFunction}</span>
        </div>
        <div>
          <span className="meta-label">ALLOY &amp; OPTICS</span>
          <span className="meta-val">{meta.materialComposition}</span>
        </div>
        <div>
          <span className="meta-label">CONCEPTUAL SPEC</span>
          <span className="meta-val">{meta.dimensions}</span>
        </div>
      </div>

      <div className="inspector-actions">
        <button
          type="button"
          className={`isolate-btn ${isIsolated ? 'active' : ''}`}
          onClick={() => onToggleIsolate(selectedComponent)}
        >
          {isIsolated ? 'Restore Full Automaton' : 'Isolate Component 3D Mesh'}
        </button>
      </div>
    </div>
  );
};
