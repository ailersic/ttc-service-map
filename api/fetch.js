import { onRequestGet } from '../functions/api/fetch.js';

export default async function handler(req, res) {
  const response = await onRequestGet({ request: req });
  const data = await response.json();
  
  res.status(response.status).json(data);
}