const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows } = await sql`
      SELECT id, status, status_label, created_at,
        COALESCE(raw_data->'demographicsForm'->>'firstName', first_name)  AS first_name,
        COALESCE(raw_data->'demographicsForm'->>'lastName',  last_name)   AS last_name,
        COALESCE(raw_data->'contactForm'->>'emailAddress',   email)       AS email,
        COALESCE(raw_data->'contactForm'->>'cellPhone',      phone)       AS phone
      FROM intakes
      ORDER BY created_at DESC;
    `;

    return res.status(200).json({ intakes: rows });
  } catch (error) {
    // If the table doesn't exist yet, return empty array to prevent breaking UI
    if (error.message.includes('relation "intakes" does not exist')) {
        return res.status(200).json({ intakes: [] });
    }
    return res.status(500).json({ error: error.message });
  }
}
