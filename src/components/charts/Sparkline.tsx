type SparklineProps = {
  values: number[];
  positive?: boolean;
};

export function Sparkline({ values, positive = true }: SparklineProps) {
  if (values.length < 2) {
    return <div className="sparkline-empty">No trend data</div>;
  }

  const width = 420;
  const height = 120;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg
      aria-label="7 day price trend"
      className="sparkline"
      preserveAspectRatio="none"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        points={points}
        stroke={positive ? '#168a50' : '#c2413b'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
}
