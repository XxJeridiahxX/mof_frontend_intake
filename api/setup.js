import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS intakes (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'submitted',
        status_label VARCHAR(50) DEFAULT 'Submitted',
        raw_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return response.status(200).json({ message: "Table created successfully", result });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
