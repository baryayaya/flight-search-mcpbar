import { VercelRequest, VercelResponse } from '@vercel/node';

const JEWISH_HOLIDAYS = {
  '2025': [
    { name: 'Tu BiShvat', date: '2025-02-13' },
    { name: 'Purim', date: '2025-03-14' },
    { name: 'Passover', date: '2025-04-13', endDate: '2025-04-20' },
    { name: 'Yom HaShoah', date: '2025-04-24' },
    { name: 'Yom HaZikaron', date: '2025-05-01' },
    { name: 'Yom HaAtzmaut', date: '2025-05-02' },
    { name: 'Lag BaOmer', date: '2025-05-18' },
    { name: 'Yom Yerushalayim', date: '2025-06-01' },
    { name: 'Shavuot', date: '2025-06-02', endDate: '2025-06-03' },
    { name: 'Rosh Hashanah', date: '2025-09-16', endDate: '2025-09-17' },
    { name: 'Yom Kippur', date: '2025-09-25' },
    { name: 'Sukkot', date: '2025-09-30', endDate: '2025-10-06' },
    { name: 'Simchat Torah', date: '2025-10-07' },
    { name: 'Hanukkah', date: '2025-12-15', endDate: '2025-12-22' }
  ]
};

interface FlightResult {
  airline: string;
  price: number;
  currency: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  baggageIncluded: boolean;
  refundable: boolean;
  source: string;
  bookingUrl: string;
  priceRating: 'cheap' | 'medium' | 'expensive';
  jewishHolidayNearby?: string;
}

class FlightSearchService {
  private generateMockResults(source: string, origin: string, destination: string, depDate: string): FlightResult[] {
    const results: FlightResult[] = [];
    const basePrice = 200 + Math.random() * 800;

    for (let i = 0; i < 3; i++) {
      const price = basePrice + (Math.random() - 0.5) * 200;
      results.push({
        airline: source,
        price: Math.round(price),
        currency: 'USD',
        departure: depDate + 'T10:00:00',
        arrival: depDate + 'T15:00:00',
        duration: '5h 0m',
        stops: Math.floor(Math.random() * 2),
        baggageIncluded: Math.random() > 0.5,
        refundable: Math.random() > 0.7,
        source,
        bookingUrl: 'https://example.com',
        priceRating: price < 300 ? 'cheap' : price < 600 ? 'medium' : 'expensive'
      });
    }
    return results;
  }

  public async searchFlights(params: any) {
    const sources = ['Amadeus', 'Kiwi.com', 'Google Flights', 'Expedia', 'Kayak'];
    const results: FlightResult[] = [];
    
    for (const source of sources) {
      const sourceResults = this.generateMockResults(source, params.origin, params.destination, params.departureDate);
      results.push(...sourceResults);
    }

    return {
      searchParams: params,
      totalResults: results.length,
      bestFlights: results.slice(0, 10),
      summary: { message: `Found ${results.length} flights from ${params.origin} to ${params.destination}` }
    };
  }

  public getJewishHolidays(year: string) {
    const holidays = JEWISH_HOLIDAYS[year as keyof typeof JEWISH_HOLIDAYS] || [];
    return {
      year,
      holidays,
      summary: { total: holidays.length, message: `Found ${holidays.length} Jewish holidays for ${year}` }
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const flightService = new FlightSearchService();
    
    if (req.method === 'POST') {
      const { tool, params } = req.body;
      
      switch (tool) {
        case 'search_flights':
          const results = await flightService.searchFlights(params);
          return res.json(results);
          
        case 'get_jewish_holidays':
          const holidays = flightService.getJewishHolidays(params.year);
          return res.json(holidays);
          
        default:
          return res.status(400).json({ error: 'Unknown tool' });
      }
    }
    
    if (req.method === 'GET') {
      return res.json({ 
        status: '✈️ Flight Search MCP Server Running',
        message: 'Welcome to the flight search system!',
        timestamp: new Date().toISOString(),
        tools: ['search_flights', 'get_jewish_holidays']
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
