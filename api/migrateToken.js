const { sql } = require("@vercel/postgres");

module.exports = async function handler(req, res) {
  try {
    await sql`ALTER TABLE intakes ADD COLUMN token VARCHAR(255) UNIQUE`;
    
    return res.status(200).json({ message: 'Migration successful: Token column added' });
  } catch (error) {
    if (error.message.includes('already exists')) {
        return res.status(200).json({ message: 'Migration skipped: Token column already exists' });
    }
    return res.status(500).json({ error: error.message });
  }
}
