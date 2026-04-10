const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID is required' });

  try {
    const { rows } = await sql`
      SELECT id, first_name, last_name, email, phone, status, status_label, raw_data, created_at
      FROM intakes WHERE id = ${id} LIMIT 1;
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ intake: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
