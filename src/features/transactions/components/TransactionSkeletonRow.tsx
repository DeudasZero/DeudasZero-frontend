export const TransactionSkeletonRow = () => (
  <tr style={{ borderBottom: '1px solid rgba(220,235,255,0.05)' }}>
    <td style={{ padding: '14px 24px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'rgba(220,235,255,0.06)',
            flexShrink: 0,
          }}
        />
        <div
          style={{ width: 140, height: 10, borderRadius: 3, background: 'rgba(220,235,255,0.06)' }}
        />
      </div>
    </td>
    <td style={{ padding: '14px 24px' }}>
      <div
        style={{ width: 50, height: 10, borderRadius: 3, background: 'rgba(220,235,255,0.06)' }}
      />
    </td>
    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
      <div
        style={{
          width: 80,
          height: 10,
          borderRadius: 3,
          background: 'rgba(220,235,255,0.06)',
          marginLeft: 'auto',
        }}
      />
    </td>
    <td style={{ padding: '14px 16px' }} />
  </tr>
)
