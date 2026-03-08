import React from 'react';

interface GaugeButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: React.ReactNode;
  percent: number;
  readyColor: string;
  gaugeColor: string;
  width?: string;
}

export const GaugeButton: React.FC<GaugeButtonProps> = ({
  onClick, disabled, label, percent, readyColor, gaugeColor, width = '140px'
}) => {
  const isReady = percent >= 100 && !disabled;
  
  return (
    <button 
      disabled={disabled} 
      onClick={onClick} 
      style={{ 
        padding: '15px', 
        width, 
        background: isReady 
          ? readyColor 
          : `linear-gradient(to top, ${gaugeColor} ${percent}%, #95a5a6 ${percent}%)`, 
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: isReady ? 'pointer' : 'default', 
        fontWeight: 'bold', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </button>
  );
};
