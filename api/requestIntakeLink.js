const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, preferredTime } = req.body;
    
    const payloadData = JSON.stringify(req.body);

    const result = await sql`
      INSERT INTO intakes (first_name, last_name, email, phone, status, status_label, raw_data)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, 'link_sent', 'Link Sent', ${payloadData})
      RETURNING id;
    `;
    
    return res.status(200).json({ message: 'Intake initiated', id: result.rows[0].id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
