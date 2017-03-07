export const analyze = (model, id) => {
  return {
    type: 'ANALYZE',
    model,
    id
  }
}
