export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      message: '✈️ Flight Search MCP Server - FIXED VERSION!',      
      status: 'working',
      hebrew: 'השרת עובד בהצלחה!',
      timestamp: new Date().toISOString(),
      author: 'baryayaya',
      version: '1.0.0'
    });
  }

  // POST request
  if (req.method === 'POST') {
    const { tool } = req.body || {};
    
    if (tool === 'search_flights') {
      return res.status(200).json({
        message: 'חיפוש טיסות מופעל!',
        flights: [
          { airline: 'אל על', price: 1200, route: 'JFK→TLV' },
          { airline: 'Delta', price: 1100, route: 'JFK→TLV' }
        ]
      });
    }

    return res.status(200).json({
      message: 'Server working!',
      receivedTool: tool
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
