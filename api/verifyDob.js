const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, dateOfBirth } = req.body;
    
    if (!token || !dateOfBirth) {
        return res.status(400).json({ error: 'Token and Date of Birth are required' });
    }

    const result = await sql`
      SELECT id, token, raw_data->>'dateOfBirth' as stored_dob
      FROM intakes
      WHERE token = ${token}
      LIMIT 1;
    `;
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Intake not found or invalid token' });
    }

    const record = result.rows[0];

    // HIPAA check: match strictly
    if (record.stored_dob === dateOfBirth) {
        return res.status(200).json({ success: true, token: record.token });
    } else {
        return res.status(401).json({ error: 'Incorrect Date of Birth' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
