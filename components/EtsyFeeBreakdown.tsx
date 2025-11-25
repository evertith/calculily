import styles from '@/styles/Calculator.module.css';

interface EtsyFeeBreakdownProps {
  showTitle?: boolean;
  compact?: boolean;
}

export default function EtsyFeeBreakdown({ showTitle = true, compact = false }: EtsyFeeBreakdownProps) {
  const fees = [
    {
      name: 'Listing Fee',
      amount: '$0.20',
      description: 'Per listing, expires/renews every 4 months',
      note: 'Also charged when an item sells (auto-relists)'
    },
    {
      name: 'Transaction Fee',
      rate: '6.5%',
      description: 'On total sale price (item + shipping)',
      note: "Etsy's main revenue source"
    },
    {
      name: 'Payment Processing',
      rate: '3% + $0.25',
      description: 'Per transaction via Etsy Payments',
      note: 'Required for most sellers'
    },
    {
      name: 'Offsite Ads Fee',
      rate: '12-15%',
      description: 'Only when ads result in sale',
      note: 'MANDATORY at $10K+ annual sales (12%); Optional under $10K (15%)'
    },
    {
      name: 'Currency Conversion',
      rate: '2.5%',
      description: 'International sales only',
      note: 'When buyer pays in different currency'
    }
  ];

  if (compact) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        {showTitle && (
          <h4 style={{ color: '#e0e0e0', marginBottom: '0.75rem', fontSize: '1rem' }}>
            Etsy Seller Fees (2025)
          </h4>
        )}
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b0b0b0', fontSize: '0.9rem' }}>
            <span>Listing Fee:</span>
            <span style={{ color: '#e0e0e0' }}>$0.20/listing</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b0b0b0', fontSize: '0.9rem' }}>
            <span>Transaction Fee:</span>
            <span style={{ color: '#e0e0e0' }}>6.5%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b0b0b0', fontSize: '0.9rem' }}>
            <span>Payment Processing:</span>
            <span style={{ color: '#e0e0e0' }}>3% + $0.25</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff6b6b', fontSize: '0.9rem' }}>
            <span>Offsite Ads (at $10K+):</span>
            <span>12%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #333'
    }}>
      {showTitle && (
        <h3 style={{ color: '#e0e0e0', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          Complete Etsy Fee Breakdown (2025)
        </h3>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Fee Type</th>
            <th style={{ textAlign: 'center', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>Amount/Rate</th>
            <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#b0b0b0', fontWeight: 500 }}>When Applied</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '1rem 0', color: '#e0e0e0', fontWeight: 500 }}>
                {fee.name}
                {fee.name === 'Offsite Ads Fee' && (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.15rem 0.4rem',
                    backgroundColor: '#2a1a1a',
                    color: '#ff6b6b',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    MANDATORY AT $10K+
                  </span>
                )}
              </td>
              <td style={{ padding: '1rem 0', color: '#4a9eff', textAlign: 'center', fontWeight: 600 }}>
                {fee.amount || fee.rate}
              </td>
              <td style={{ padding: '1rem 0' }}>
                <div style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{fee.description}</div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fee.note}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        borderLeft: '3px solid #4a9eff'
      }}>
        <h4 style={{ color: '#4a9eff', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
          Example: $40 Sale + $5 Shipping
        </h4>
        <div style={{ color: '#b0b0b0', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <div>Listing Fee: $0.20</div>
          <div>Transaction Fee (6.5% of $45): $2.93</div>
          <div>Payment Processing (3% + $0.25): $1.60</div>
          <div style={{ borderTop: '1px solid #333', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            <strong style={{ color: '#e0e0e0' }}>Total Fees: $4.73</strong> (10.5% of $45)
          </div>
          <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            *Add 12% ($4.80) if offsite ads result in this sale at $10K+ volume
          </div>
        </div>
      </div>
    </div>
  );
}
