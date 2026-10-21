import React, { useState } from 'react';

export const SizeChart = ({ categorySlug = '', sizes = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dimensions'); // 'dimensions' | 'measure'
  const [unit, setUnit] = useState('inch');                 // 'inch' | 'cm'

  // Determine if product is bottomwear (trousers/jeans) or tops (shirts/kurtas/blazers)
  const isBottomwear = categorySlug === 'trousers' || categorySlug === 'jeans';

  // Conversion helper
  const toUnit = (valInInches) => {
    if (unit === 'inch') return valInInches;
    return Math.round(valInInches * 2.54);
  };

  // Measurement charts
  const topRows = [
    { size: 'S (38)', shoulder: 16.5, chest: 38, waist: 36, length: 28.5 },
    { size: 'M (40)', shoulder: 17.5, chest: 40, waist: 38, length: 29.5 },
    { size: 'L (42)', shoulder: 18.5, chest: 42, waist: 40, length: 30.5 },
    { size: 'XL (44)', shoulder: 19.5, chest: 44, waist: 42, length: 31.5 },
    { size: 'XXL (46)', shoulder: 20.5, chest: 46, waist: 44, length: 32.5 }
  ];

  const bottomRows = [
    { size: '30', waist: 30, hip: 37, thigh: 23, length: 41 },
    { size: '32', waist: 32, hip: 39, thigh: 24, length: 41.5 },
    { size: '34', waist: 34, hip: 41, thigh: 25, length: 42 },
    { size: '36', waist: 36, hip: 43, thigh: 26, length: 42.5 },
    { size: '38', waist: 38, hip: 45, thigh: 27, length: 43 }
  ];

  const rows = isBottomwear ? bottomRows : topRows;

  return (
    <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-caramel)',
          fontSize: '0.85rem',
          fontWeight: '700',
          cursor: 'pointer',
          padding: '4px 0',
          borderBottom: '1px dashed var(--color-caramel)'
        }}
      >
        <span>📐 View Size Chart & Dimensions</span>
        <span style={{ fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>

      {/* Expandable Size Chart Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: '0.75rem',
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Header & Unit Switcher */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.75rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('dimensions')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'dimensions' ? '700' : '500',
                  color: activeTab === 'dimensions' ? 'var(--color-espresso)' : 'var(--text-muted)',
                  borderBottom: activeTab === 'dimensions' ? '2px solid var(--color-caramel)' : 'none',
                  paddingBottom: '4px'
                }}
              >
                Product Dimensions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('measure')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'measure' ? '700' : '500',
                  color: activeTab === 'measure' ? 'var(--color-espresso)' : 'var(--text-muted)',
                  borderBottom: activeTab === 'measure' ? '2px solid var(--color-caramel)' : 'none',
                  paddingBottom: '4px'
                }}
              >
                How to Measure
              </button>
            </div>

            {/* Unit Selector (inch / cm) */}
            {activeTab === 'dimensions' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit:</span>
                <div
                  style={{
                    display: 'inline-flex',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setUnit('inch')}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      fontWeight: unit === 'inch' ? '700' : '500',
                      backgroundColor: unit === 'inch' ? 'var(--color-espresso)' : 'var(--color-white)',
                      color: unit === 'inch' ? 'var(--color-cream)' : 'var(--color-espresso)'
                    }}
                  >
                    inch
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('cm')}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      fontWeight: unit === 'cm' ? '700' : '500',
                      backgroundColor: unit === 'cm' ? 'var(--color-espresso)' : 'var(--color-white)',
                      color: unit === 'cm' ? 'var(--color-cream)' : 'var(--color-espresso)'
                    }}
                  >
                    cm
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tab 1: Dimensions Table */}
          {activeTab === 'dimensions' ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-latte-soft)', color: 'var(--color-espresso)' }}>
                    <th style={{ padding: '8px 10px', fontWeight: '700' }}>Size</th>
                    {isBottomwear ? (
                      <>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Waist ({unit})</th>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Hip ({unit})</th>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Thigh ({unit})</th>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Length ({unit})</th>
                      </>
                    ) : (
                      <>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Shoulder ({unit})</th>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Chest ({unit})</th>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Waist ({unit})</th>
                        <th style={{ padding: '8px 10px', fontWeight: '700' }}>Length ({unit})</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: i % 2 === 0 ? 'var(--color-white)' : 'rgba(250, 246, 240, 0.5)'
                      }}
                    >
                      <td style={{ padding: '8px 10px', fontWeight: '700', color: 'var(--color-espresso)' }}>
                        {r.size}
                      </td>
                      {isBottomwear ? (
                        <>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.waist)}</td>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.hip)}</td>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.thigh)}</td>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.length)}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.shoulder)}</td>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.chest)}</td>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.waist)}</td>
                          <td style={{ padding: '8px 10px' }}>{toUnit(r.length)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                💡 Tip: If you prefer a relaxed fit or between sizes, we recommend ordering one size up. Visit MR SM Store in Subedari, Hanamkonda for custom fitting!
              </div>
            </div>
          ) : (
            /* Tab 2: How to Measure */
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isBottomwear ? (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem', listStyle: 'disc' }}>
                  <li><strong>Waist:</strong> Measure around your natural waistline where you normally wear your trousers.</li>
                  <li><strong>Hip:</strong> Measure around the fullest part of your hips and seat while standing naturally.</li>
                  <li><strong>Inseam Length:</strong> Measure from the top of the inner leg seam down to the bottom of your ankle.</li>
                </ul>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem', listStyle: 'disc' }}>
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal under your arms.</li>
                  <li><strong>Shoulder:</strong> Measure across the back from the edge of one shoulder bone to the other.</li>
                  <li><strong>Shirt Length:</strong> Measure from the highest point of the shoulder seam straight down to the bottom hem.</li>
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SizeChart;
