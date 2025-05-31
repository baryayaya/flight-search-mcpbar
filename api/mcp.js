export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'GET') {
    return res.json({
      status: '✈️ Flight Search MCP Server - WORKING!',
      message: 'השרת עובד!',
      timestamp: new Date().toISOString(),
      tools: ['search_flights', 'get_jewish_holidays']
    });
  }
  
  return res.json({ message: 'Server is running!' });
}
