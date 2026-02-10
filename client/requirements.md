## Packages
recharts | For analytics dashboard charts (line chart, radar chart)
framer-motion | For smooth page transitions and micro-interactions
date-fns | For formatting dates in history and charts

## Notes
- Chatbot uses SSE (Server-Sent Events) at POST /api/conversations/:id/messages
- Auth relies on httpOnly cookies
- Quiz requires timer logic for "fake" detection (< 2s avg per question)
- Tailwind Config needs extension for 'font-display' (Outfit) and 'font-body' (DM Sans)
