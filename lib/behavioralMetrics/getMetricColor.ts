export const getMetricColor = (value: number): string => {
  if (value >= 0.7) return 'bg-lab-green'
  if (value >= 0.4) return 'bg-lab-accent'
  if (value >= 0.2) return 'bg-lab-warning'
  return 'bg-lab-red'
}

