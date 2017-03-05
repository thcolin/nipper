export const analyze = (v) => {
  return {
    type: 'ANALYZE',
    v
  }
}

export const setStep = (step) => {
  return {
    type: 'SET_STEP',
    step
  }
}
