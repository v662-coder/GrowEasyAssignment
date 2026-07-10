import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// If using Gemini
// import { GoogleGenerativeAI } from '@google/generative-ai';
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractFieldsWithAI = async (records) => {
  try {
    const prompt = buildAIPrompt(records);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert data extraction AI. Extract CRM lead information from CSV data.
          
          CRM Fields to extract:
          - created_at: Lead creation date (must be valid JS Date)
          - name: Lead name
          - email: Primary email
          - country_code: Country code (e.g., +91)
          - mobile_without_country_code: Mobile number without country code
          - company: Company name
          - city: City
          - state: State
          - country: Country
          - lead_owner: Lead owner
          - crm_status: Must be one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
          - crm_note: Notes, remarks, extra emails/phones
          - data_source: Must be one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots
          - possession_time: Property possession time
          - description: Additional description

          RULES:
          1. If multiple emails exist, use first as email, put rest in crm_note
          2. If multiple mobile numbers, use first as mobile, put rest in crm_note
          3. Skip records with neither email nor mobile
          4. created_at must be valid Date format
          5. Only use allowed crm_status values
          6. Only use allowed data_source values
          7. Keep each record as single CSV row
          8. Use crm_note for any extra information`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    // Parse AI response
    const extracted = JSON.parse(response.choices[0].message.content);
    return extracted;
  } catch (error) {
    console.error('AI Extraction Error:', error);
    throw new Error(`AI extraction failed: ${error.message}`);
  }
};

const buildAIPrompt = (records) => {
  const sampleRecords = records.slice(0, 10); // Send only 10 as sample
  const headers = Object.keys(records[0] || {});
  
  return `Extract CRM fields from these CSV records.

Headers: ${headers.join(', ')}
Records:
${JSON.stringify(sampleRecords, null, 2)}

Instructions:
1. Analyze the column headers and data
2. Intelligently map fields to CRM format
3. Handle variations in column names (e.g., 'Full Name' → name, 'Phone' → mobile)
4. Extract all possible fields
5. Return as JSON array of extracted records

Example output format:
[
  {
    "created_at": "2026-05-13T14:20:48.000Z",
    "name": "John Doe",
    "email": "john@example.com",
    "country_code": "+91",
    "mobile_without_country_code": "9876543210",
    "company": "GrowEasy",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "lead_owner": "test@gmail.com",
    "crm_status": "GOOD_LEAD_FOLLOW_UP",
    "crm_note": "Client is asking to reschedule demo",
    "data_source": "leads_on_demand",
    "possession_time": "",
    "description": ""
  }
]

Remember:
- Each record must have at least email OR mobile
- Use valid crm_status values only
- created_at must be valid JavaScript Date format
- Keep response as valid JSON only, no extra text`;
};