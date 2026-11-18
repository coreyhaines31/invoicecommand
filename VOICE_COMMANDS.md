# 🎤 Voice Commands Guide for Invoice Command

Invoice Command supports natural language voice commands powered by OpenAI GPT-6 Luna through the Vercel AI Gateway. Simply toggle **Voice Mode** in the invoice form and speak your commands naturally.

## 🚀 Getting Started

1. **Enable Voice Mode** - Toggle the switch in the invoice form
2. **Click Record** - Allow microphone access when prompted
3. **Speak Naturally** - Use any of the commands below
4. **Auto-Processing** - Commands are processed when recording stops

## 📋 Supported Voice Commands

### **Client Information**
```
"Change client name to ABC Company"
"Set client email to john@abccompany.com"
"Update client address to 123 Main Street"
"Set client city to New York"
"Change client state to New York"
"Set client zip code to 10001"
```

### **Line Items**
```
"Add 5 hours of consulting at $150 per hour"
"Add $200 design fee"
"Add 3 licenses at $99 each"
"Add web development for $2500"
"Remove the last item"
"Update first item to 8 hours"
"Change the price of item 2 to $300"
```

### **Financial Settings**
```
"Set tax rate to 8.5 percent"
"Change tax to 10%"
"Set discount rate to 5 percent"
"Apply 15% discount"
"Remove tax"
"Remove discount"
```

### **Dates**
```
"Set due date to January 15th"
"Change due date to next Friday"
"Set invoice date to today"
"Due date is 30 days from now"
"Set due date to December 31st 2024"
```

### **Invoice Details**
```
"Change invoice number to INV-2024-001"
"Set business name to My Company LLC"
"Add note: Please pay within 30 days"
"Update terms to Net 15 payment terms"
"Set my email to billing@mycompany.com"
```

### **Business Information**
```
"Set business address to 456 Business Ave"
"Change my phone number to 555-123-4567"
"Update business city to San Francisco"
"Set business state to California"
"Change zip code to 94102"
```

## 💡 Tips for Best Results

### **Speak Clearly**
- Use a clear, normal speaking pace
- Minimize background noise
- Speak directly into your microphone

### **Be Specific**
- ✅ "Add 5 hours of consulting at $150 per hour"
- ❌ "Add some consulting work"

### **Use Natural Language**
- ✅ "Set tax rate to eight and a half percent"
- ✅ "Set tax rate to 8.5%"
- ✅ "Tax should be 8.5 percent"

### **Include Context**
- ✅ "Change the client name to ABC Company"
- ✅ "Update first line item to 8 hours"
- ✅ "Set due date to January 15th"

## 🎯 Command Examples by Scenario

### **Starting a New Invoice**
```
1. "Set business name to Freelance Design Studio"
2. "Set client name to TechCorp Industries"
3. "Add logo design for $500"
4. "Add 10 hours of consulting at $125 per hour"
5. "Set tax rate to 8.25 percent"
6. "Due date is 30 days from now"
```

### **Modifying Existing Items**
```
1. "Change the first item quantity to 15 hours"
2. "Update the price of item 2 to $750"
3. "Remove the last line item"
4. "Add 20% discount"
```

### **Common Corrections**
```
1. "Change client email to correct@email.com"
2. "Fix the tax rate to 9.5 percent"
3. "Update due date to February 1st"
4. "Change invoice number to INV-2024-Q1-001"
```

## 🔧 Technical Details

### **Supported Browsers**
- ✅ Chrome (recommended)
- ✅ Safari
- ✅ Microsoft Edge
- ❌ Firefox (limited support)

### **Privacy & Security**
- The transcript and current invoice are sent to OpenAI through the Vercel AI Gateway
- No voice recordings are stored locally
- Transcripts are not saved after processing
- All invoice data remains in your browser's localStorage

### **Error Handling**
- Commands that aren't understood will show an error message
- Partial commands may be processed with clarification
- You can always edit manually if voice commands fail

## 🎙️ Recording Controls

- **Record Button** - Start/stop voice recording
- **Status Badge** - Shows current recording state
- **Confidence Score** - Displays speech recognition accuracy
- **Transcript Display** - Shows what was heard before processing
- **Manual Process** - Click "Process" to manually submit transcript

## 🚨 Troubleshooting

### **Microphone Issues**
1. Check browser permissions for microphone access
2. Ensure microphone is not muted
3. Try refreshing the page and re-enabling voice mode

### **Command Not Recognized**
1. Speak more clearly and slowly
2. Use simpler, more direct language
3. Try breaking complex commands into smaller parts
4. Check the supported command examples above

### **Processing Errors**
1. Ensure you have an active internet connection
2. Verify the AI Gateway credential is configured (for developers)
3. Try the command again with different wording

## 🔑 For Developers

To enable voice commands in your development environment:

1. **Set up the Vercel AI Gateway**:
   ```bash
   # Add to .env.local, or run `vercel env pull` on a linked project for an OIDC token
   AI_GATEWAY_API_KEY=your_gateway_key_here
   ```
   On Vercel the gateway authenticates with the deployment's OIDC token, so production needs no key.

2. **Voice Processing Endpoint**:
   - Located at `/api/parse-voice`
   - Uses `openai/gpt-6-luna` by default; set `VOICE_MODEL` to another gateway model ID to override
   - `npm run eval:voice -- --model <id>` grades a model against `evals/voice/cases.json`
   - Returns structured JSON updates for invoice data

3. **Error Handling**:
   - API rate limiting
   - Invalid command responses
   - Microphone permission issues

---

**Happy voice commanding!** 🎤✨

For support or feature requests, visit: [GitHub Issues](https://github.com/coreyhaines31/invoicecommand/issues)