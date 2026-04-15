import React from 'react';
import {
  WAIT_TIME_OPTIONS,
  formatWaitTime,
} from '../../../utils/adminSettings';
import './AdminWaitTimeSection.less';
import './AdminWaitTimeSection.less';

interface AdminWaitTimeSectionProps {
  waitTimeMinutes: number;
  onChange: (minutes: number) => void;
}

export const AdminWaitTimeSection: React.FC<AdminWaitTimeSectionProps> = ({
  waitTimeMinutes,
  onChange,
}) => {
  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Čakacia doba</h2>
      <div className="admin-panel__select-group">
        <label htmlFor="waitTime">Výber čakacej doby:</label>
        <select
          id="waitTime"
          value={waitTimeMinutes}
          onChange={(e) => onChange(Number(e.target.value))}
          className="admin-panel__select"
        >
          {WAIT_TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-panel__preview">
        <h3>Náhľad oznámenia:</h3>
        <p>
          Z dôvodu veľkého počtu objednávok je čakacia doba momentálne
          <strong>{formatWaitTime(waitTimeMinutes)}</strong>. Ďakujeme za
          pochopenie."
        </p>
      </div>
    </div>
  );
};
