import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows } = await sql`
      SELECT id, first_name, last_name, email, phone, status, status_label, created_at 
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
