# 🧾 Product Requirements Document (PRD)

### Project: **Invoice Command**

### Version: v1.0 (MVP + Scalable Architecture)

------------------------------------------------------------------------

## 1. 🎯 **Product Summary**

**Invoice Command** is a free, single-page invoicing app that lets users
**build, preview, and edit invoices in real time** --- either manually
or by **speaking naturally** and having AI translate their words into
structured invoice updates.

It's designed to:\
- Be **free and public** (no login required for basic use).\
- Store data **locally in the browser**.\
- Support **programmatic SEO** across hundreds of niche invoice use
cases.\
- Monetize through **Stripe Connect kickbacks** and **\$20/month premium
features** (automated recurring invoices, advanced workflows, custom
branding, etc.).

The **core app is the homepage** --- fast, interactive, and instantly
usable.

------------------------------------------------------------------------

## 2. 🧭 **Goals & Success Criteria**

  -----------------------------------------------------------------------
  Goal            KPI / Success Metric
  --------------- -------------------------------------------------------
  ✅ Launch a     App live, 0→1 usability
  fully           
  functional      
  invoice builder 
  MVP             

  ✅ Enable       \<50ms latency UI updates
  real-time       
  editing and     
  preview         

  ✅ Integrate    Users can send & get paid
  Stripe Connect  
  (Express)       

  ✅ Generate     Indexed pages per category
  100+            
  SEO-optimized   
  landing pages   

  ✅ Achieve      Stripe account activations
  first 100       
  connected       
  Stripe users    

  ✅ Paid         Premium plan subscribers
  conversions at  
  2--3% of active 
  users           
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. 🧱 **Core Features**

### **A. Public Invoice Builder**

-   No signup required.
-   Left panel: **Live invoice preview** (auto-updates with every
    change).\
-   Right panel: **Form-based editor** for invoice fields:
    -   Sender (Your business info)
    -   Recipient (Client info)
    -   Line items (Description, Quantity, Price)
    -   Tax, Discount, Total
    -   Notes, Terms, Due Date\
-   All data persists in **localStorage**.

### **B. Real-Time Preview**

-   Two-way binding between form and preview.
-   Instant updates (\<50ms latency).
-   Auto-formatting for currency, dates, totals.

**Implementation:**\
React state + `useSyncExternalStore` + Zustand for store → rendered via
Tailwind-styled React components.

------------------------------------------------------------------------

### **C. Voice & AI Dictation**

Checkbox toggle below the form: - **Manual Mode:** User types invoice
changes.\
- **Voice Mode:**\
- Uses **Web Speech API** for real-time speech recognition.\
- On submit, sends transcribed text → **AI parsing API** (OpenAI
GPT-4o-mini).\
- AI converts text to structured JSON diff (ex: "Add \$200 design fee to
John" → updates invoice model).\
- UI updates instantly.

**AI Prompt Example:** \> "Extract all invoice-related changes (client,
amount, line items, due date) and return structured JSON."

------------------------------------------------------------------------

### **D. Stripe Integration (Monetization)**

#### 1. **Free users**

-   Can generate invoices, export PDF, or share download links.

#### 2. **Stripe Connect users**

-   Can **create payment-enabled invoices**.
-   Onboard via **Stripe Express** (Connect).\
-   Payments processed through their Stripe account.
-   **You take a small application fee (e.g., 0.5--1%)**.

#### 3. **Premium users (\$20/mo)**

-   Unlock advanced features:
    -   Recurring invoices & auto-sending
    -   Custom branding (logo, colors)
    -   Email tracking (sent/viewed)
    -   Payment reminders & late fees
    -   CSV export, analytics dashboard

------------------------------------------------------------------------

### **E. Programmatic SEO Pages**

#### 1. Structure

-   `/invoice-for-[profession]/` (freelancers, electricians, designers,
    etc.)
-   Auto-generated via Next.js SSG from a static JSON or CMS (e.g.,
    Supabase table or Markdown directory).
-   Each page:
    -   H1: "Free \[Profession\] Invoice Template"
    -   Intro paragraph explaining typical line items.
    -   Embedded app (pre-filled with relevant template).
    -   Schema.org structured data for `SoftwareApplication` + `HowTo`.

#### 2. Example Templates

-   Freelance Designer Invoice
-   Electrician Invoice
-   Photographer Invoice
-   Marketing Consultant Invoice
-   Plumber Invoice
-   Yoga Instructor Invoice\
    *(Eventually 200+ total --- generated from structured JSON data.)*

------------------------------------------------------------------------

## 4. 💻 **Technical Stack**

  -----------------------------------------------------------------------
  Layer                 Tech               Purpose
  --------------------- ------------------ ------------------------------
  **Frontend**          Next.js 15 (App    Core framework
                        Router) +          
                        TypeScript         

  **UI**                Tailwind CSS +     Fast, responsive styling
                        shadcn/ui          

  **State Management**  Zustand            Lightweight, reactive store

  **Voice Input**       Web Speech API     Browser-based dictation

  **AI Parsing**        OpenAI GPT-4o-mini Natural language → structured
                        via API Route      edits

  **PDF Generation**    react-pdf          Invoice export/download

  **Payments**          Stripe Connect     Monetization + onboarding
                        (Express)          

  **Backend**           Next.js API routes Stripe + AI endpoints
                        (serverless)       

  **Database**          Supabase           For registered users +
                        (Postgres)         invoices

  **Auth**              Supabase Auth or   For Stripe-connected accounts
                        Clerk              

  **Hosting**           Vercel             Serverless deployment

  **Analytics**         PostHog            Feature usage + retention
                                           tracking

  **SEO**               Next.js SSG +      Programmatic SEO
                        schema.org         
                        metadata           
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 5. 🧮 **Data Model**

### `invoice`

  Field                 Type      Description
  --------------------- --------- -----------------------------------
  id                    UUID      Unique ID
  user_id               UUID      Null if anonymous
  client_name           string    Client name
  items                 JSON      Line items \[{desc, qty, price}\]
  subtotal              float     Calculated
  tax                   float     Calculated
  total                 float     subtotal + tax
  due_date              date      Optional
  notes                 text      Optional
  stripe_payment_link   string    Optional
  recurring             boolean   Premium only

### `user`

  Field               Type                      Description
  ------------------- ------------------------- ---------------------
  id                  UUID                      Unique user
  email               string                    Auth
  stripe_account_id   string                    For Connect Express
  plan                enum(`free`, `premium`)   Subscription level
  last_login          timestamp                 For analytics

------------------------------------------------------------------------

## 6. ⚙️ **API Endpoints (Next.js)**

  --------------------------------------------------------------------------------
  Endpoint                          Method            Description
  --------------------------------- ----------------- ----------------------------
  `/api/create-connected-account`   POST              Creates Stripe Express
                                                      account

  `/api/create-checkout-session`    POST              Creates Stripe Checkout for
                                                      invoice payment

  `/api/webhooks/stripe`            POST              Handles payments and
                                                      subscriptions

  `/api/parse-voice`                POST              Converts voice → structured
                                                      invoice JSON

  `/api/invoice`                    POST/GET          Save/retrieve invoices
                                                      (premium users)
  --------------------------------------------------------------------------------

------------------------------------------------------------------------

## 7. ⚡ **User Flow**

1.  **Landing (Home Page)**
    -   Left: blank invoice preview.\
    -   Right: editable form.\
    -   Below form: "Type or Speak" toggle.\
    -   Bottom CTA: "Download PDF" or "Send via Stripe."
2.  **User toggles 'Voice Mode' → speaks invoice.**
    -   Text transcribed → sent to `/api/parse-voice` → invoice updates
        live.
3.  **User wants to collect payment → clicks "Enable Payments."**
    -   Redirects to Stripe Connect onboarding (Express).\
    -   After connecting, invoices can include "Pay Now" buttons.
4.  **User subscribes for automation (\$20/mo)**
    -   Managed through Stripe Subscriptions.\
    -   Unlocks recurring and workflow settings.
5.  **pSEO Visitors**
    -   Land on prefilled invoice templates for their niche.\
    -   Can immediately customize + export.\
    -   Convert to Stripe users or premium plan.

------------------------------------------------------------------------

## 8. 💸 **Monetization Strategy**

  ---------------------------------------------------------------------------
  Tier          Features            Price          Revenue Type
  ------------- ------------------- -------------- --------------------------
  **Free**      Invoice builder,    \$0            Volume & traffic
                PDF export                         

  **Stripe      Collect payments    Free           0.5--1% app fee
  Connect**                                        

  **Premium**   Recurring invoices, \$20/mo        Subscription revenue
                automations,                       
                branding                           
  ---------------------------------------------------------------------------

------------------------------------------------------------------------

## 9. 🌐 **SEO & Growth Strategy**

-   **Programmatic SEO:**
    -   200--300 pages from JSON-driven templates.\
    -   Metadata generated dynamically (title, description, structured
        data).\
-   **Search intent:** "Free \[profession\] invoice template."\
-   **Content structure:**
    -   H1: Free \[Profession\] Invoice Template\
    -   Short explanation paragraph\
    -   Embedded live app\
    -   CTA: Generate your invoice\
    -   FAQ section\
-   **Schema markup:** `SoftwareApplication` + `FAQPage` + `HowTo`.

------------------------------------------------------------------------

## 10. 🚀 **Phased Development Plan**

### **Phase 1 (Weeks 1--4): MVP**

-   Static Next.js app with invoice builder.\
-   LocalStorage persistence.\
-   PDF export.\
-   pSEO structure + \~20 templates.

### **Phase 2 (Weeks 5--8): Monetization**

-   Stripe Connect Express onboarding.\
-   Payment collection with app fee.\
-   Stripe Subscriptions for premium plan.

### **Phase 3 (Weeks 9--12): AI & Voice**

-   Add voice dictation (Web Speech API).\
-   AI parsing endpoint (OpenAI API).\
-   Live real-time invoice updates via voice.

### **Phase 4 (Weeks 13--16): Growth & Scale**

-   Add 200+ templates for pSEO.\
-   Launch analytics + PostHog tracking.\
-   Add referral flow (optional Stripe partner link).
