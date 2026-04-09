const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body; // Vercel automatically parses JSON
    
    // Extract key info or fallback to empty strings if not present
    const firstName = body.demographicsForm?.firstName || 'Unknown';
    const lastName = body.demographicsForm?.lastName || 'Patient';
    const email = body.demographicsForm?.email || '';
    const phone = body.demographicsForm?.phone || '';
    const token = body.token;
    
    let result;
    if (token) {
        result = await sql`
          UPDATE intakes
          SET first_name = ${firstName},
              last_name = ${lastName},
              email = ${email},
              phone = ${phone},
              status = 'submitted',
              status_label = 'Submitted',
              raw_data = ${JSON.stringify(body)}
          WHERE token = ${token}
          RETURNING id;
        `;
    } else {
        result = await sql`
          INSERT INTO intakes (first_name, last_name, email, phone, status, status_label, raw_data)
          VALUES (${firstName}, ${lastName}, ${email}, ${phone}, 'submitted', 'Submitted', ${JSON.stringify(body)})
          RETURNING id;
        `;
    }
    
    return res.status(200).json({ message: 'Intake submitted successfully', id: result.rows[0]?.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
