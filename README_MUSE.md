# Muse Application Page - Setup Guide

## What's Been Created

✅ **New "Muse" Page** (`/muse/index.html`)
- Styled to match the Better Human aesthetic (black/red/white theme)
- Hero image from Unsplash
- Requirements section listing ideal muse characteristics
- Application form with all necessary fields
- Responsive design for mobile and desktop

✅ **Menu Integration**
- "Muse" menu item added to all pages (index, about, business, muse)
- Properly integrated into existing navigation

✅ **Environment Configuration**
- `.env` file created for storing Notion credentials
- `.env.example` file for reference

## Next Steps: Notion Integration

To complete the Notion integration, you need to:

### 1. Get Your Notion Integration Token (NOT OAuth!)

**Important:** You need the **Internal Integration Token**, not OAuth credentials.

1. Go to your integration page: https://www.notion.so/my-integrations
2. Click on your integration (e.g., "ByBetterHuman")
3. Look for the **"Internal Integration Token"** section (NOT OAuth!)
4. Click **"Show"** then **"Copy"**
5. It should start with `secret_`

**If you only see OAuth settings:**
- You may have created a "Public Integration" instead of an "Internal Integration"
- Go back to https://www.notion.so/my-integrations
- Click **"+ New integration"**
- Make sure **"Internal Integration"** is selected (not Public)
- Fill in the basic info and submit
- You'll then see the "Internal Integration Token"

### 2. Add Your Credentials to `.env`

Open the `.env` file and replace the placeholder values:

```env
NOTION_API_KEY=secret_your_actual_integration_token_here
NOTION_DATABASE_ID=your_actual_database_id_here
```

### 2. Set Up Your Notion Database

Your Notion database should have the following properties:

| Property Name | Type | Description |
|--------------|------|-------------|
| Name | Title | Applicant's full name |
| Email | Email | Contact email |
| Age | Number | Applicant's age |
| Location | Text | City, State/Country |
| Instagram | Text | Instagram handle |
| Social | Text | Other social media links |
| Photos | URL | Portfolio URL |
| Why | Text (Long) | Why they'd be a good muse |
| Submitted | Date | Auto-filled submission date |

### 3. Backend Options

You have several options for connecting the form to Notion:

#### Option A: Serverless Function (Recommended)

**Using Netlify Functions:**

1. Create `netlify/functions/submit-muse.js`:

```javascript
const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const data = JSON.parse(event.body);

  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: data.name } }] },
        Email: { email: data.email },
        Age: { number: parseInt(data.age) },
        Location: { rich_text: [{ text: { content: data.location } }] },
        Instagram: { rich_text: [{ text: { content: data.instagram || '' } }] },
        Social: { rich_text: [{ text: { content: data.social || '' } }] },
        Photos: { url: data.photos },
        Why: { rich_text: [{ text: { content: data.why } }] },
        Submitted: { date: { start: new Date().toISOString() } }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit' })
    };
  }
};
```

2. Install dependencies:
```bash
npm install @notionhq/client
```

3. Update the form endpoint in `/muse/index.html`:
```javascript
const response = await fetch('/.netlify/functions/submit-muse', {
```

#### Option B: Vercel Serverless Function

Similar setup but in `/api/submit-muse.js`

#### Option C: Node.js Backend Server

If you prefer a traditional server, create an Express.js backend.

### 4. Security Notes

⚠️ **Important:**
- Never expose your `NOTION_API_KEY` in frontend code
- Always use environment variables
- Add `.env` to your `.gitignore` file
- The backend function handles the secure API calls

### 5. Testing

1. Fill out the form at `/muse/`
2. Submit the application
3. Check your Notion database for the new entry

## File Structure

```
/bybetterhuman
├── .env                    # Your Notion credentials (DO NOT COMMIT)
├── .env.example           # Template for credentials
├── muse/
│   └── index.html         # Muse application page
├── images/
│   └── muse-hero.jpg      # Hero image for muse page
└── README_MUSE.md         # This file
```

## Troubleshooting

**Form not submitting?**
- Check browser console for errors
- Verify Notion credentials in `.env`
- Ensure database is shared with your integration

**Database not receiving data?**
- Confirm property names match exactly
- Check that integration has access to the database
- Review serverless function logs

## Support

For questions or issues:
- Email: info@bybetterhuman.com
- Check Notion API docs: https://developers.notion.com/

---

**Created:** March 1, 2026
**Version:** 1.0
