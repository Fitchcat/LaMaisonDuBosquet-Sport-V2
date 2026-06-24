export default async function handler(req, res) {
  try {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxMYmyUgs53eMH1WouqeTKfyfOKHQ1gokVU6cTJohoklE4FMyXggZf_z7DiVqQnmH6ID-NVu-cQ1kn/pub?gid=1740182240&single=true&output=csv';
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error('Google Sheets fetch failed');
    const csvText = await response.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).send(csvText);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tarifs' });
  }
}
