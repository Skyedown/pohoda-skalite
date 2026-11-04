import React from 'react';
import type { LegalBlock } from '../../../legal/types';

interface LegalBlocksProps {
  blocks: LegalBlock[];
}

const LegalBlockView: React.FC<{ block: LegalBlock }> = ({ block }) => {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>;
    case 'ul':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div className="privacy-policy__table-wrapper">
          <table className="privacy-policy__table">
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td
                      key={`${index}-${cell}`}
                      data-label={block.headers[index]}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
};

export const LegalBlocks: React.FC<LegalBlocksProps> = ({ blocks }) => (
  <>
    {blocks.map((block, index) => (
      <LegalBlockView key={`${block.type}-${index}`} block={block} />
    ))}
  </>
);
