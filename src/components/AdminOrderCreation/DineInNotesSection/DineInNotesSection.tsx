import React from 'react';
import './DineInNotesSection.less';

interface DineInNotesSectionProps {
  notes: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const DineInNotesSection: React.FC<DineInNotesSectionProps> = ({
  notes,
  onChange,
}) => {
  return (
    <div className="dine-in-notes-section">
      <h3 className="dine-in-notes-section__title">Poznámka (voliteľné)</h3>
      <div className="form-group">
        <textarea
          name="notes"
          className="form-group__textarea"
          placeholder="Napr. číslo stola, špeciálne požiadavky..."
          value={notes}
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default DineInNotesSection;
