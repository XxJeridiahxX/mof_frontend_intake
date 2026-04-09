const { sql } = require("@vercel/postgres");
const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, preferredTime } = req.body;
    
    // Generate a secure, randomized token for HIPAA lookup
    const token = crypto.randomUUID();
    const payloadData = JSON.stringify(req.body);

    const result = await sql`
      INSERT INTO intakes (token, first_name, last_name, email, phone, status, status_label, raw_data)
      VALUES (${token}, ${firstName}, ${lastName}, ${email}, ${phone}, 'link_sent', 'Link Sent', ${payloadData})
      RETURNING token;
    `;
    
    return res.status(200).json({ message: 'Intake initiated', token: result.rows[0].token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
