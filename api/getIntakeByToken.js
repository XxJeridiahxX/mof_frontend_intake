const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const { rows } = await sql`
      SELECT raw_data FROM intakes WHERE token = ${token} LIMIT 1;
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Intake not found' });
    }

    return res.status(200).json({ data: rows[0].raw_data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
