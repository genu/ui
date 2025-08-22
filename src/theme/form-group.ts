export default {
  slots: {
    root: 'border border-default rounded-lg p-4',
    legend: 'block font-medium text-default mb-3',
    wrapper: 'space-y-4'
  },
  variants: {
    size: {
      xs: { root: 'p-2', legend: 'text-xs mb-2', wrapper: 'space-y-2' },
      sm: { root: 'p-3', legend: 'text-sm mb-2', wrapper: 'space-y-3' },
      md: { root: 'p-4', legend: 'text-sm mb-3', wrapper: 'space-y-4' },
      lg: { root: 'p-5', legend: 'text-base mb-3', wrapper: 'space-y-4' },
      xl: { root: 'p-6', legend: 'text-lg mb-4', wrapper: 'space-y-5' }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
