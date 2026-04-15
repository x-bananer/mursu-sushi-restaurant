export const placeholder = (name) => (req, res) => {
  res.status(200).json({
    message: `Endpoint "${name}" not implemented yet`,
    method: req.method,
    path: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body || null
  });
};
