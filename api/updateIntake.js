const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status, status_label, raw_data } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Intake ID is required' });
  }

  try {
    // Extract top-level fields from raw_data for indexed columns
    const firstName = raw_data?.demographicsForm?.firstName || raw_data?.firstName || null;
    const lastName  = raw_data?.demographicsForm?.lastName  || raw_data?.lastName  || null;
    const email     = raw_data?.contactForm?.emailAddress   || raw_data?.email     || null;
    const phone     = raw_data?.contactForm?.cellPhone      || raw_data?.phone     || null;

    await sql`
      UPDATE intakes SET
        status        = ${status},
        status_label  = ${status_label},
        raw_data      = ${JSON.stringify(raw_data)},
        first_name    = COALESCE(${firstName}, first_name),
        last_name     = COALESCE(${lastName},  last_name),
        email         = COALESCE(${email},     email),
        phone         = COALESCE(${phone},      phone)
      WHERE id = ${id}
    `;

    return res.status(200).json({ message: 'Intake updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
