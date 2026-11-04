import React from 'react';
import './PizzaZero.less';

// The missing slice spans -70° to -25° on a pizza centred at (100, 100).
const PIZZA_CRUST = 'M100 100 L179.7 62.8 A88 88 0 1 1 130.1 17.3 Z';
const PIZZA_TOP = 'M100 100 L168.9 67.9 A76 76 0 1 1 126 28.6 Z';
const SLICE_CRUST = 'M100 100 L130.1 17.3 A88 88 0 0 1 179.7 62.8 Z';
const SLICE_TOP = 'M100 100 L126 28.6 A76 76 0 0 1 168.9 67.9 Z';

const PIZZA_PEPPERONI: [number, number][] = [
  [70, 60],
  [52, 108],
  [92, 142],
  [140, 118],
  [104, 82],
  [80, 162],
  [150, 150],
];
const SLICE_PEPPERONI: [number, number][] = [
  [148, 62],
  [130, 45],
];
const PIZZA_BASIL: [number, number, number][] = [
  [82, 112, 20],
  [122, 148, -35],
  [60, 82, 60],
];

/** The zero of "404": a pizza with a slice drifting away from it. */
export const PizzaZero: React.FC = () => (
  <svg className="pizza-zero" viewBox="-10 -30 230 240" aria-hidden="true">
    <g>
      <path className="pizza-zero__crust" d={PIZZA_CRUST} />
      <path className="pizza-zero__cheese" d={PIZZA_TOP} />
      {PIZZA_PEPPERONI.map(([cx, cy]) => (
        <circle
          key={`p${cx}-${cy}`}
          className="pizza-zero__pepperoni"
          cx={cx}
          cy={cy}
          r={9}
        />
      ))}
      {PIZZA_BASIL.map(([cx, cy, angle]) => (
        <ellipse
          key={`b${cx}-${cy}`}
          className="pizza-zero__basil"
          cx={cx}
          cy={cy}
          rx={7}
          ry={3.5}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle className="pizza-zero__crumb" cx={168} cy={34} r={2.5} />
      <circle className="pizza-zero__crumb" cx={160} cy={24} r={1.8} />
    </g>
    <g className="pizza-zero__slice">
      <path className="pizza-zero__crust" d={SLICE_CRUST} />
      <path className="pizza-zero__cheese" d={SLICE_TOP} />
      {SLICE_PEPPERONI.map(([cx, cy]) => (
        <circle
          key={`s${cx}-${cy}`}
          className="pizza-zero__pepperoni"
          cx={cx}
          cy={cy}
          r={9}
        />
      ))}
    </g>
  </svg>
);
