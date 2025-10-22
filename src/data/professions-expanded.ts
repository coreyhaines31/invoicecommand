export interface ProfessionData {
  id: string;
  name: string;
  profession: string; // Clean profession name for titles (e.g., "Freelance Writer")
  title: string; // SEO title: "[Profession] Invoice Template (Free)"
  description: string;
  keywords: string[];
  commonServices: string[];
  averageRates: {
    hourly?: string;
    project?: string;
  };
  industryInfo: string;
  seoDescription: string;
}

export const professions: ProfessionData[] = [
  {
    "id": "3d-printing-service",
    "name": "3d Printing Service",
    "profession": "3d Printing Service",
    "title": "3d Printing Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for 3d printing services and related service professionals.",
    "keywords": [
      "3d printing service invoice template",
      "invoice template for 3d printing service",
      "3d printing service billing template",
      "free 3d printing service invoice",
      "3d printing service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "3d Printing Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free 3d printing service invoice template. Professional billing format with customizable fields for 3d printing service services."
  },
  {
    "id": "accounting",
    "name": "Accounting",
    "profession": "Accounting",
    "title": "Accounting Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for accountings and related business professionals.",
    "keywords": [
      "accounting invoice template",
      "invoice template for accounting",
      "accounting billing template",
      "free accounting invoice",
      "accounting invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Accountings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free accounting invoice template. Professional billing format with customizable fields for accounting services."
  },
  {
    "id": "act-tutor",
    "name": "Act Tutor",
    "profession": "Act Tutor",
    "title": "Act Tutor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for act tutors and related business professionals.",
    "keywords": [
      "act tutor invoice template",
      "invoice template for act tutor",
      "act tutor billing template",
      "free act tutor invoice",
      "act tutor invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Act Tutors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free act tutor invoice template. Professional billing format with customizable fields for act tutor services."
  },
  {
    "id": "acupuncturist",
    "name": "Acupuncturist",
    "profession": "Acupuncturist",
    "title": "Acupuncturist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for acupuncturists and related business professionals.",
    "keywords": [
      "acupuncturist invoice template",
      "invoice template for acupuncturist",
      "acupuncturist billing template",
      "free acupuncturist invoice",
      "acupuncturist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Acupuncturists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free acupuncturist invoice template. Professional billing format with customizable fields for acupuncturist services."
  },
  {
    "id": "advertising-agency",
    "name": "Advertising Agency",
    "profession": "Advertising Agency",
    "title": "Advertising Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for advertising agencys and related business professionals.",
    "keywords": [
      "advertising agency invoice template",
      "invoice template for advertising agency",
      "advertising agency billing template",
      "free advertising agency invoice",
      "advertising agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Advertising Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free advertising agency invoice template. Professional billing format with customizable fields for advertising agency services."
  },
  {
    "id": "air-duct-cleaning",
    "name": "Air Duct Cleaning",
    "profession": "Air Duct Cleaning",
    "title": "Air Duct Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for air duct cleanings and related business professionals.",
    "keywords": [
      "air duct cleaning invoice template",
      "invoice template for air duct cleaning",
      "air duct cleaning billing template",
      "free air duct cleaning invoice",
      "air duct cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Air Duct Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free air duct cleaning invoice template. Professional billing format with customizable fields for air duct cleaning services."
  },
  {
    "id": "airbnb-cleaning",
    "name": "Airbnb Cleaning",
    "profession": "Airbnb Cleaning",
    "title": "Airbnb Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for airbnb cleanings and related business professionals.",
    "keywords": [
      "airbnb cleaning invoice template",
      "invoice template for airbnb cleaning",
      "airbnb cleaning billing template",
      "free airbnb cleaning invoice",
      "airbnb cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Airbnb Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free airbnb cleaning invoice template. Professional billing format with customizable fields for airbnb cleaning services."
  },
  {
    "id": "amazon-seller",
    "name": "Amazon Seller",
    "profession": "Amazon Seller",
    "title": "Amazon Seller Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for amazon sellers and related business professionals.",
    "keywords": [
      "amazon seller invoice template",
      "invoice template for amazon seller",
      "amazon seller billing template",
      "free amazon seller invoice",
      "amazon seller invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Amazon Sellers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free amazon seller invoice template. Professional billing format with customizable fields for amazon seller services."
  },
  {
    "id": "analytics-consultant",
    "name": "Analytics Consultant",
    "profession": "Analytics Consultant",
    "title": "Analytics Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for analytics consultants and related business professionals.",
    "keywords": [
      "analytics consultant invoice template",
      "invoice template for analytics consultant",
      "analytics consultant billing template",
      "free analytics consultant invoice",
      "analytics consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Analytics Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free analytics consultant invoice template. Professional billing format with customizable fields for analytics consultant services."
  },
  {
    "id": "animation",
    "name": "Animation",
    "profession": "Animation",
    "title": "Animation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for animations and related business professionals.",
    "keywords": [
      "animation invoice template",
      "invoice template for animation",
      "animation billing template",
      "free animation invoice",
      "animation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Animations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free animation invoice template. Professional billing format with customizable fields for animation services."
  },
  {
    "id": "app-developer",
    "name": "App Developer",
    "profession": "App Developer",
    "title": "App Developer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for app developers and related business professionals.",
    "keywords": [
      "app developer invoice template",
      "invoice template for app developer",
      "app developer billing template",
      "free app developer invoice",
      "app developer invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$50-150",
      "project": "$1000-50000"
    },
    "industryInfo": "App Developers typically charge between $50-150 per hour depending on experience and project complexity.",
    "seoDescription": "Free app developer invoice template. Professional billing format with customizable fields for app developer services."
  },
  {
    "id": "appliance-repair",
    "name": "Appliance Repair",
    "profession": "Appliance Repair",
    "title": "Appliance Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for appliance repairs and related business professionals.",
    "keywords": [
      "appliance repair invoice template",
      "invoice template for appliance repair",
      "appliance repair billing template",
      "free appliance repair invoice",
      "appliance repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Appliance Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free appliance repair invoice template. Professional billing format with customizable fields for appliance repair services."
  },
  {
    "id": "arborist",
    "name": "Arborist",
    "profession": "Arborist",
    "title": "Arborist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for arborists and related business professionals.",
    "keywords": [
      "arborist invoice template",
      "invoice template for arborist",
      "arborist billing template",
      "free arborist invoice",
      "arborist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Arborists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free arborist invoice template. Professional billing format with customizable fields for arborist services."
  },
  {
    "id": "architect",
    "name": "Architect",
    "profession": "Architect",
    "title": "Architect Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for architects and related business professionals.",
    "keywords": [
      "architect invoice template",
      "invoice template for architect",
      "architect billing template",
      "free architect invoice",
      "architect invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Architects typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free architect invoice template. Professional billing format with customizable fields for architect services."
  },
  {
    "id": "art-director",
    "name": "Art Director",
    "profession": "Art Director",
    "title": "Art Director Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for art directors and related business professionals.",
    "keywords": [
      "art director invoice template",
      "invoice template for art director",
      "art director billing template",
      "free art director invoice",
      "art director invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Art Directors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free art director invoice template. Professional billing format with customizable fields for art director services."
  },
  {
    "id": "asbestos-removal",
    "name": "Asbestos Removal",
    "profession": "Asbestos Removal",
    "title": "Asbestos Removal Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for asbestos removals and related business professionals.",
    "keywords": [
      "asbestos removal invoice template",
      "invoice template for asbestos removal",
      "asbestos removal billing template",
      "free asbestos removal invoice",
      "asbestos removal invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Asbestos Removals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free asbestos removal invoice template. Professional billing format with customizable fields for asbestos removal services."
  },
  {
    "id": "au-pair",
    "name": "Au Pair",
    "profession": "Au Pair",
    "title": "Au Pair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for au pairs and related business professionals.",
    "keywords": [
      "au pair invoice template",
      "invoice template for au pair",
      "au pair billing template",
      "free au pair invoice",
      "au pair invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Au Pairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free au pair invoice template. Professional billing format with customizable fields for au pair services."
  },
  {
    "id": "audio-engineer",
    "name": "Audio Engineer",
    "profession": "Audio Engineer",
    "title": "Audio Engineer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for audio engineers and related business professionals.",
    "keywords": [
      "audio engineer invoice template",
      "invoice template for audio engineer",
      "audio engineer billing template",
      "free audio engineer invoice",
      "audio engineer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Audio Engineers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free audio engineer invoice template. Professional billing format with customizable fields for audio engineer services."
  },
  {
    "id": "auto-body-repair",
    "name": "Auto Body Repair",
    "profession": "Auto Body Repair",
    "title": "Auto Body Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for auto body repairs and related business professionals.",
    "keywords": [
      "auto body repair invoice template",
      "invoice template for auto body repair",
      "auto body repair billing template",
      "free auto body repair invoice",
      "auto body repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Auto Body Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free auto body repair invoice template. Professional billing format with customizable fields for auto body repair services."
  },
  {
    "id": "auto-detailing",
    "name": "Auto Detailing",
    "profession": "Auto Detailing",
    "title": "Auto Detailing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for auto detailings and related business professionals.",
    "keywords": [
      "auto detailing invoice template",
      "invoice template for auto detailing",
      "auto detailing billing template",
      "free auto detailing invoice",
      "auto detailing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Auto Detailings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free auto detailing invoice template. Professional billing format with customizable fields for auto detailing services."
  },
  {
    "id": "babysitter",
    "name": "Babysitter",
    "profession": "Babysitter",
    "title": "Babysitter Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for babysitters and related business professionals.",
    "keywords": [
      "babysitter invoice template",
      "invoice template for babysitter",
      "babysitter billing template",
      "free babysitter invoice",
      "babysitter invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Babysitters typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free babysitter invoice template. Professional billing format with customizable fields for babysitter services."
  },
  {
    "id": "bail-bondsman",
    "name": "Bail Bondsman",
    "profession": "Bail Bondsman",
    "title": "Bail Bondsman Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bail bondsmans and related business professionals.",
    "keywords": [
      "bail bondsman invoice template",
      "invoice template for bail bondsman",
      "bail bondsman billing template",
      "free bail bondsman invoice",
      "bail bondsman invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bail Bondsmans typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bail bondsman invoice template. Professional billing format with customizable fields for bail bondsman services."
  },
  {
    "id": "baker",
    "name": "Baker",
    "profession": "Baker",
    "title": "Baker Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bakers and related business professionals.",
    "keywords": [
      "baker invoice template",
      "invoice template for baker",
      "baker billing template",
      "free baker invoice",
      "baker invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bakers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free baker invoice template. Professional billing format with customizable fields for baker services."
  },
  {
    "id": "balloon-artist",
    "name": "Balloon Artist",
    "profession": "Balloon Artist",
    "title": "Balloon Artist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for balloon artists and related business professionals.",
    "keywords": [
      "balloon artist invoice template",
      "invoice template for balloon artist",
      "balloon artist billing template",
      "free balloon artist invoice",
      "balloon artist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Balloon Artists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free balloon artist invoice template. Professional billing format with customizable fields for balloon artist services."
  },
  {
    "id": "band",
    "name": "Band",
    "profession": "Band",
    "title": "Band Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bands and related business professionals.",
    "keywords": [
      "band invoice template",
      "invoice template for band",
      "band billing template",
      "free band invoice",
      "band invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bands typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free band invoice template. Professional billing format with customizable fields for band services."
  },
  {
    "id": "bar-catering",
    "name": "Bar Catering",
    "profession": "Bar Catering",
    "title": "Bar Catering Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bar caterings and related business professionals.",
    "keywords": [
      "bar catering invoice template",
      "invoice template for bar catering",
      "bar catering billing template",
      "free bar catering invoice",
      "bar catering invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bar Caterings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bar catering invoice template. Professional billing format with customizable fields for bar catering services."
  },
  {
    "id": "barber",
    "name": "Barber",
    "profession": "Barber",
    "title": "Barber Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for barbers and related business professionals.",
    "keywords": [
      "barber invoice template",
      "invoice template for barber",
      "barber billing template",
      "free barber invoice",
      "barber invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Barbers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free barber invoice template. Professional billing format with customizable fields for barber services."
  },
  {
    "id": "bartender",
    "name": "Bartender",
    "profession": "Bartender",
    "title": "Bartender Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bartenders and related business professionals.",
    "keywords": [
      "bartender invoice template",
      "invoice template for bartender",
      "bartender billing template",
      "free bartender invoice",
      "bartender invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bartenders typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bartender invoice template. Professional billing format with customizable fields for bartender services."
  },
  {
    "id": "basement-waterproofing",
    "name": "Basement Waterproofing",
    "profession": "Basement Waterproofing",
    "title": "Basement Waterproofing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for basement waterproofings and related business professionals.",
    "keywords": [
      "basement waterproofing invoice template",
      "invoice template for basement waterproofing",
      "basement waterproofing billing template",
      "free basement waterproofing invoice",
      "basement waterproofing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Basement Waterproofings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free basement waterproofing invoice template. Professional billing format with customizable fields for basement waterproofing services."
  },
  {
    "id": "bjj-coach",
    "name": "Bjj Coach",
    "profession": "Bjj Coach",
    "title": "Bjj Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bjj coachs and related business professionals.",
    "keywords": [
      "bjj coach invoice template",
      "invoice template for bjj coach",
      "bjj coach billing template",
      "free bjj coach invoice",
      "bjj coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bjj Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bjj coach invoice template. Professional billing format with customizable fields for bjj coach services."
  },
  {
    "id": "blacksmith",
    "name": "Blacksmith",
    "profession": "Blacksmith",
    "title": "Blacksmith Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for blacksmiths and related business professionals.",
    "keywords": [
      "blacksmith invoice template",
      "invoice template for blacksmith",
      "blacksmith billing template",
      "free blacksmith invoice",
      "blacksmith invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Blacksmiths typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free blacksmith invoice template. Professional billing format with customizable fields for blacksmith services."
  },
  {
    "id": "blogger",
    "name": "Blogger",
    "profession": "Blogger",
    "title": "Blogger Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bloggers and related business professionals.",
    "keywords": [
      "blogger invoice template",
      "invoice template for blogger",
      "blogger billing template",
      "free blogger invoice",
      "blogger invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bloggers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free blogger invoice template. Professional billing format with customizable fields for blogger services."
  },
  {
    "id": "boat-repair",
    "name": "Boat Repair",
    "profession": "Boat Repair",
    "title": "Boat Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for boat repairs and related business professionals.",
    "keywords": [
      "boat repair invoice template",
      "invoice template for boat repair",
      "boat repair billing template",
      "free boat repair invoice",
      "boat repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Boat Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free boat repair invoice template. Professional billing format with customizable fields for boat repair services."
  },
  {
    "id": "bodyguard",
    "name": "Bodyguard",
    "profession": "Bodyguard",
    "title": "Bodyguard Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bodyguards and related business professionals.",
    "keywords": [
      "bodyguard invoice template",
      "invoice template for bodyguard",
      "bodyguard billing template",
      "free bodyguard invoice",
      "bodyguard invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bodyguards typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bodyguard invoice template. Professional billing format with customizable fields for bodyguard services."
  },
  {
    "id": "bookkeeper",
    "name": "Bookkeeper",
    "profession": "Bookkeeper",
    "title": "Bookkeeper Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bookkeepers and related business professionals.",
    "keywords": [
      "bookkeeper invoice template",
      "invoice template for bookkeeper",
      "bookkeeper billing template",
      "free bookkeeper invoice",
      "bookkeeper invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bookkeepers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bookkeeper invoice template. Professional billing format with customizable fields for bookkeeper services."
  },
  {
    "id": "bookkeeping",
    "name": "Bookkeeping",
    "profession": "Bookkeeping",
    "title": "Bookkeeping Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for bookkeepings and related business professionals.",
    "keywords": [
      "bookkeeping invoice template",
      "invoice template for bookkeeping",
      "bookkeeping billing template",
      "free bookkeeping invoice",
      "bookkeeping invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Bookkeepings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free bookkeeping invoice template. Professional billing format with customizable fields for bookkeeping services."
  },
  {
    "id": "boxing-coach",
    "name": "Boxing Coach",
    "profession": "Boxing Coach",
    "title": "Boxing Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for boxing coachs and related business professionals.",
    "keywords": [
      "boxing coach invoice template",
      "invoice template for boxing coach",
      "boxing coach billing template",
      "free boxing coach invoice",
      "boxing coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Boxing Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free boxing coach invoice template. Professional billing format with customizable fields for boxing coach services."
  },
  {
    "id": "brand-designer",
    "name": "Brand Designer",
    "profession": "Brand Designer",
    "title": "Brand Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for brand designers and related business professionals.",
    "keywords": [
      "brand designer invoice template",
      "invoice template for brand designer",
      "brand designer billing template",
      "free brand designer invoice",
      "brand designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Brand Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free brand designer invoice template. Professional billing format with customizable fields for brand designer services."
  },
  {
    "id": "branding",
    "name": "Branding",
    "profession": "Branding",
    "title": "Branding Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for brandings and related business professionals.",
    "keywords": [
      "branding invoice template",
      "invoice template for branding",
      "branding billing template",
      "free branding invoice",
      "branding invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Brandings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free branding invoice template. Professional billing format with customizable fields for branding services."
  },
  {
    "id": "brow-artist",
    "name": "Brow Artist",
    "profession": "Brow Artist",
    "title": "Brow Artist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for brow artists and related business professionals.",
    "keywords": [
      "brow artist invoice template",
      "invoice template for brow artist",
      "brow artist billing template",
      "free brow artist invoice",
      "brow artist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Brow Artists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free brow artist invoice template. Professional billing format with customizable fields for brow artist services."
  },
  {
    "id": "business-coach",
    "name": "Business Coach",
    "profession": "Business Coach",
    "title": "Business Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for business coachs and related business professionals.",
    "keywords": [
      "business coach invoice template",
      "invoice template for business coach",
      "business coach billing template",
      "free business coach invoice",
      "business coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Business Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free business coach invoice template. Professional billing format with customizable fields for business coach services."
  },
  {
    "id": "business-consultant",
    "name": "Business Consultant",
    "profession": "Business Consultant",
    "title": "Business Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for business consultants and related business professionals.",
    "keywords": [
      "business consultant invoice template",
      "invoice template for business consultant",
      "business consultant billing template",
      "free business consultant invoice",
      "business consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$75-300",
      "project": "$2000-100000"
    },
    "industryInfo": "Business Consultants typically charge between $75-300 per hour depending on experience and project complexity.",
    "seoDescription": "Free business consultant invoice template. Professional billing format with customizable fields for business consultant services."
  },
  {
    "id": "business-development",
    "name": "Business Development",
    "profession": "Business Development",
    "title": "Business Development Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for business developments and related business professionals.",
    "keywords": [
      "business development invoice template",
      "invoice template for business development",
      "business development billing template",
      "free business development invoice",
      "business development invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Business Developments typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free business development invoice template. Professional billing format with customizable fields for business development services."
  },
  {
    "id": "business-services",
    "name": "Business Services",
    "profession": "Business Services",
    "title": "Business Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for business servicess and related service professionals.",
    "keywords": [
      "business services invoice template",
      "invoice template for business services",
      "business services billing template",
      "free business services invoice",
      "business services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Business Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free business services invoice template. Professional billing format with customizable fields for business services services."
  },
  {
    "id": "cabinet-installer",
    "name": "Cabinet Installer",
    "profession": "Cabinet Installer",
    "title": "Cabinet Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cabinet installers and related business professionals.",
    "keywords": [
      "cabinet installer invoice template",
      "invoice template for cabinet installer",
      "cabinet installer billing template",
      "free cabinet installer invoice",
      "cabinet installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cabinet Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cabinet installer invoice template. Professional billing format with customizable fields for cabinet installer services."
  },
  {
    "id": "cad-designer",
    "name": "Cad Designer",
    "profession": "Cad Designer",
    "title": "Cad Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cad designers and related business professionals.",
    "keywords": [
      "cad designer invoice template",
      "invoice template for cad designer",
      "cad designer billing template",
      "free cad designer invoice",
      "cad designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cad Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cad designer invoice template. Professional billing format with customizable fields for cad designer services."
  },
  {
    "id": "cake-designer",
    "name": "Cake Designer",
    "profession": "Cake Designer",
    "title": "Cake Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cake designers and related business professionals.",
    "keywords": [
      "cake designer invoice template",
      "invoice template for cake designer",
      "cake designer billing template",
      "free cake designer invoice",
      "cake designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cake Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cake designer invoice template. Professional billing format with customizable fields for cake designer services."
  },
  {
    "id": "car-rental",
    "name": "Car Rental",
    "profession": "Car Rental",
    "title": "Car Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for car rentals and related business professionals.",
    "keywords": [
      "car rental invoice template",
      "invoice template for car rental",
      "car rental billing template",
      "free car rental invoice",
      "car rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Car Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free car rental invoice template. Professional billing format with customizable fields for car rental services."
  },
  {
    "id": "car-wash",
    "name": "Car Wash",
    "profession": "Car Wash",
    "title": "Car Wash Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for car washs and related business professionals.",
    "keywords": [
      "car wash invoice template",
      "invoice template for car wash",
      "car wash billing template",
      "free car wash invoice",
      "car wash invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Car Washs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free car wash invoice template. Professional billing format with customizable fields for car wash services."
  },
  {
    "id": "career-coach",
    "name": "Career Coach",
    "profession": "Career Coach",
    "title": "Career Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for career coachs and related business professionals.",
    "keywords": [
      "career coach invoice template",
      "invoice template for career coach",
      "career coach billing template",
      "free career coach invoice",
      "career coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Career Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free career coach invoice template. Professional billing format with customizable fields for career coach services."
  },
  {
    "id": "career-consultant",
    "name": "Career Consultant",
    "profession": "Career Consultant",
    "title": "Career Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for career consultants and related business professionals.",
    "keywords": [
      "career consultant invoice template",
      "invoice template for career consultant",
      "career consultant billing template",
      "free career consultant invoice",
      "career consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Career Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free career consultant invoice template. Professional billing format with customizable fields for career consultant services."
  },
  {
    "id": "caregiver",
    "name": "Caregiver",
    "profession": "Caregiver",
    "title": "Caregiver Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for caregivers and related business professionals.",
    "keywords": [
      "caregiver invoice template",
      "invoice template for caregiver",
      "caregiver billing template",
      "free caregiver invoice",
      "caregiver invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Caregivers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free caregiver invoice template. Professional billing format with customizable fields for caregiver services."
  },
  {
    "id": "carpet-cleaning",
    "name": "Carpet Cleaning",
    "profession": "Carpet Cleaning",
    "title": "Carpet Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for carpet cleanings and related business professionals.",
    "keywords": [
      "carpet cleaning invoice template",
      "invoice template for carpet cleaning",
      "carpet cleaning billing template",
      "free carpet cleaning invoice",
      "carpet cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Carpet Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free carpet cleaning invoice template. Professional billing format with customizable fields for carpet cleaning services."
  },
  {
    "id": "carpet-installer",
    "name": "Carpet Installer",
    "profession": "Carpet Installer",
    "title": "Carpet Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for carpet installers and related business professionals.",
    "keywords": [
      "carpet installer invoice template",
      "invoice template for carpet installer",
      "carpet installer billing template",
      "free carpet installer invoice",
      "carpet installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Carpet Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free carpet installer invoice template. Professional billing format with customizable fields for carpet installer services."
  },
  {
    "id": "catering",
    "name": "Catering",
    "profession": "Catering",
    "title": "Catering Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for caterings and related business professionals.",
    "keywords": [
      "catering invoice template",
      "invoice template for catering",
      "catering billing template",
      "free catering invoice",
      "catering invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Caterings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free catering invoice template. Professional billing format with customizable fields for catering services."
  },
  {
    "id": "chimney-sweep",
    "name": "Chimney Sweep",
    "profession": "Chimney Sweep",
    "title": "Chimney Sweep Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for chimney sweeps and related business professionals.",
    "keywords": [
      "chimney sweep invoice template",
      "invoice template for chimney sweep",
      "chimney sweep billing template",
      "free chimney sweep invoice",
      "chimney sweep invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Chimney Sweeps typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free chimney sweep invoice template. Professional billing format with customizable fields for chimney sweep services."
  },
  {
    "id": "chiropractor",
    "name": "Chiropractor",
    "profession": "Chiropractor",
    "title": "Chiropractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for chiropractors and related business professionals.",
    "keywords": [
      "chiropractor invoice template",
      "invoice template for chiropractor",
      "chiropractor billing template",
      "free chiropractor invoice",
      "chiropractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$100-400",
      "project": "$200-5000"
    },
    "industryInfo": "Chiropractors typically charge between $100-400 per hour depending on experience and project complexity.",
    "seoDescription": "Free chiropractor invoice template. Professional billing format with customizable fields for chiropractor services."
  },
  {
    "id": "civil-engineer",
    "name": "Civil Engineer",
    "profession": "Civil Engineer",
    "title": "Civil Engineer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for civil engineers and related business professionals.",
    "keywords": [
      "civil engineer invoice template",
      "invoice template for civil engineer",
      "civil engineer billing template",
      "free civil engineer invoice",
      "civil engineer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Civil Engineers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free civil engineer invoice template. Professional billing format with customizable fields for civil engineer services."
  },
  {
    "id": "cleaning-service",
    "name": "Cleaning Service",
    "profession": "Cleaning Service",
    "title": "Cleaning Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cleaning services and related service professionals.",
    "keywords": [
      "cleaning service invoice template",
      "invoice template for cleaning service",
      "cleaning service billing template",
      "free cleaning service invoice",
      "cleaning service invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$25-75",
      "project": "$100-5000"
    },
    "industryInfo": "Cleaning Services typically charge between $25-75 per hour depending on experience and project complexity.",
    "seoDescription": "Free cleaning service invoice template. Professional billing format with customizable fields for cleaning service services."
  },
  {
    "id": "cloud-consultant",
    "name": "Cloud Consultant",
    "profession": "Cloud Consultant",
    "title": "Cloud Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cloud consultants and related business professionals.",
    "keywords": [
      "cloud consultant invoice template",
      "invoice template for cloud consultant",
      "cloud consultant billing template",
      "free cloud consultant invoice",
      "cloud consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cloud Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cloud consultant invoice template. Professional billing format with customizable fields for cloud consultant services."
  },
  {
    "id": "cnc-machining",
    "name": "Cnc Machining",
    "profession": "Cnc Machining",
    "title": "Cnc Machining Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cnc machinings and related business professionals.",
    "keywords": [
      "cnc machining invoice template",
      "invoice template for cnc machining",
      "cnc machining billing template",
      "free cnc machining invoice",
      "cnc machining invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cnc Machinings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cnc machining invoice template. Professional billing format with customizable fields for cnc machining services."
  },
  {
    "id": "coffee-cart",
    "name": "Coffee Cart",
    "profession": "Coffee Cart",
    "title": "Coffee Cart Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for coffee carts and related business professionals.",
    "keywords": [
      "coffee cart invoice template",
      "invoice template for coffee cart",
      "coffee cart billing template",
      "free coffee cart invoice",
      "coffee cart invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Coffee Carts typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free coffee cart invoice template. Professional billing format with customizable fields for coffee cart services."
  },
  {
    "id": "college-counselor",
    "name": "College Counselor",
    "profession": "College Counselor",
    "title": "College Counselor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for college counselors and related business professionals.",
    "keywords": [
      "college counselor invoice template",
      "invoice template for college counselor",
      "college counselor billing template",
      "free college counselor invoice",
      "college counselor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "College Counselors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free college counselor invoice template. Professional billing format with customizable fields for college counselor services."
  },
  {
    "id": "colorist",
    "name": "Colorist",
    "profession": "Colorist",
    "title": "Colorist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for colorists and related business professionals.",
    "keywords": [
      "colorist invoice template",
      "invoice template for colorist",
      "colorist billing template",
      "free colorist invoice",
      "colorist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Colorists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free colorist invoice template. Professional billing format with customizable fields for colorist services."
  },
  {
    "id": "commercial-cleaning",
    "name": "Commercial Cleaning",
    "profession": "Commercial Cleaning",
    "title": "Commercial Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for commercial cleanings and related business professionals.",
    "keywords": [
      "commercial cleaning invoice template",
      "invoice template for commercial cleaning",
      "commercial cleaning billing template",
      "free commercial cleaning invoice",
      "commercial cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Commercial Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free commercial cleaning invoice template. Professional billing format with customizable fields for commercial cleaning services."
  },
  {
    "id": "commercial-printer",
    "name": "Commercial Printer",
    "profession": "Commercial Printer",
    "title": "Commercial Printer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for commercial printers and related business professionals.",
    "keywords": [
      "commercial printer invoice template",
      "invoice template for commercial printer",
      "commercial printer billing template",
      "free commercial printer invoice",
      "commercial printer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Commercial Printers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free commercial printer invoice template. Professional billing format with customizable fields for commercial printer services."
  },
  {
    "id": "composer",
    "name": "Composer",
    "profession": "Composer",
    "title": "Composer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for composers and related business professionals.",
    "keywords": [
      "composer invoice template",
      "invoice template for composer",
      "composer billing template",
      "free composer invoice",
      "composer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Composers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free composer invoice template. Professional billing format with customizable fields for composer services."
  },
  {
    "id": "concrete",
    "name": "Concrete",
    "profession": "Concrete",
    "title": "Concrete Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for concretes and related business professionals.",
    "keywords": [
      "concrete invoice template",
      "invoice template for concrete",
      "concrete billing template",
      "free concrete invoice",
      "concrete invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Concretes typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free concrete invoice template. Professional billing format with customizable fields for concrete services."
  },
  {
    "id": "construction",
    "name": "Construction",
    "profession": "Construction",
    "title": "Construction Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for constructions and related business professionals.",
    "keywords": [
      "construction invoice template",
      "invoice template for construction",
      "construction billing template",
      "free construction invoice",
      "construction invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Constructions typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free construction invoice template. Professional billing format with customizable fields for construction services."
  },
  {
    "id": "consulting-firm",
    "name": "Consulting Firm",
    "profession": "Consulting Firm",
    "title": "Consulting Firm Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for consulting firms and related business professionals.",
    "keywords": [
      "consulting firm invoice template",
      "invoice template for consulting firm",
      "consulting firm billing template",
      "free consulting firm invoice",
      "consulting firm invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Consulting Firms typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free consulting firm invoice template. Professional billing format with customizable fields for consulting firm services."
  },
  {
    "id": "content-writer",
    "name": "Content Writer",
    "profession": "Content Writer",
    "title": "Content Writer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for content writers and related business professionals.",
    "keywords": [
      "content writer invoice template",
      "invoice template for content writer",
      "content writer billing template",
      "free content writer invoice",
      "content writer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Content Writers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free content writer invoice template. Professional billing format with customizable fields for content writer services."
  },
  {
    "id": "contractor",
    "name": "Contractor",
    "profession": "Contractor",
    "title": "Contractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for contractors and related business professionals.",
    "keywords": [
      "contractor invoice template",
      "invoice template for contractor",
      "contractor billing template",
      "free contractor invoice",
      "contractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Contractors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free contractor invoice template. Professional billing format with customizable fields for contractor services."
  },
  {
    "id": "copy-editing",
    "name": "Copy Editing",
    "profession": "Copy Editing",
    "title": "Copy Editing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for copy editings and related business professionals.",
    "keywords": [
      "copy editing invoice template",
      "invoice template for copy editing",
      "copy editing billing template",
      "free copy editing invoice",
      "copy editing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Copy Editings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free copy editing invoice template. Professional billing format with customizable fields for copy editing services."
  },
  {
    "id": "copywriter",
    "name": "Copywriter",
    "profession": "Copywriter",
    "title": "Copywriter Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for copywriters and related business professionals.",
    "keywords": [
      "copywriter invoice template",
      "invoice template for copywriter",
      "copywriter billing template",
      "free copywriter invoice",
      "copywriter invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Copywriters typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free copywriter invoice template. Professional billing format with customizable fields for copywriter services."
  },
  {
    "id": "corporate-photographer",
    "name": "Corporate Photographer",
    "profession": "Corporate Photographer",
    "title": "Corporate Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for corporate photographers and related business professionals.",
    "keywords": [
      "corporate photographer invoice template",
      "invoice template for corporate photographer",
      "corporate photographer billing template",
      "free corporate photographer invoice",
      "corporate photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Corporate Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free corporate photographer invoice template. Professional billing format with customizable fields for corporate photographer services."
  },
  {
    "id": "cosmetic-nurse-injector",
    "name": "Cosmetic Nurse Injector",
    "profession": "Cosmetic Nurse Injector",
    "title": "Cosmetic Nurse Injector Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cosmetic nurse injectors and related business professionals.",
    "keywords": [
      "cosmetic nurse injector invoice template",
      "invoice template for cosmetic nurse injector",
      "cosmetic nurse injector billing template",
      "free cosmetic nurse injector invoice",
      "cosmetic nurse injector invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cosmetic Nurse Injectors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cosmetic nurse injector invoice template. Professional billing format with customizable fields for cosmetic nurse injector services."
  },
  {
    "id": "costume-designer",
    "name": "Costume Designer",
    "profession": "Costume Designer",
    "title": "Costume Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for costume designers and related business professionals.",
    "keywords": [
      "costume designer invoice template",
      "invoice template for costume designer",
      "costume designer billing template",
      "free costume designer invoice",
      "costume designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Costume Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free costume designer invoice template. Professional billing format with customizable fields for costume designer services."
  },
  {
    "id": "counseling-center",
    "name": "Counseling Center",
    "profession": "Counseling Center",
    "title": "Counseling Center Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for counseling centers and related business professionals.",
    "keywords": [
      "counseling center invoice template",
      "invoice template for counseling center",
      "counseling center billing template",
      "free counseling center invoice",
      "counseling center invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Counseling Centers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free counseling center invoice template. Professional billing format with customizable fields for counseling center services."
  },
  {
    "id": "counselor",
    "name": "Counselor",
    "profession": "Counselor",
    "title": "Counselor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for counselors and related business professionals.",
    "keywords": [
      "counselor invoice template",
      "invoice template for counselor",
      "counselor billing template",
      "free counselor invoice",
      "counselor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Counselors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free counselor invoice template. Professional billing format with customizable fields for counselor services."
  },
  {
    "id": "countertop-installer",
    "name": "Countertop Installer",
    "profession": "Countertop Installer",
    "title": "Countertop Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for countertop installers and related business professionals.",
    "keywords": [
      "countertop installer invoice template",
      "invoice template for countertop installer",
      "countertop installer billing template",
      "free countertop installer invoice",
      "countertop installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Countertop Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free countertop installer invoice template. Professional billing format with customizable fields for countertop installer services."
  },
  {
    "id": "courier",
    "name": "Courier",
    "profession": "Courier",
    "title": "Courier Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for couriers and related business professionals.",
    "keywords": [
      "courier invoice template",
      "invoice template for courier",
      "courier billing template",
      "free courier invoice",
      "courier invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Couriers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free courier invoice template. Professional billing format with customizable fields for courier services."
  },
  {
    "id": "court-reporter",
    "name": "Court Reporter",
    "profession": "Court Reporter",
    "title": "Court Reporter Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for court reporters and related business professionals.",
    "keywords": [
      "court reporter invoice template",
      "invoice template for court reporter",
      "court reporter billing template",
      "free court reporter invoice",
      "court reporter invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Court Reporters typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free court reporter invoice template. Professional billing format with customizable fields for court reporter services."
  },
  {
    "id": "creative-agency",
    "name": "Creative Agency",
    "profession": "Creative Agency",
    "title": "Creative Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for creative agencys and related business professionals.",
    "keywords": [
      "creative agency invoice template",
      "invoice template for creative agency",
      "creative agency billing template",
      "free creative agency invoice",
      "creative agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Creative Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free creative agency invoice template. Professional billing format with customizable fields for creative agency services."
  },
  {
    "id": "creative-director",
    "name": "Creative Director",
    "profession": "Creative Director",
    "title": "Creative Director Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for creative directors and related business professionals.",
    "keywords": [
      "creative director invoice template",
      "invoice template for creative director",
      "creative director billing template",
      "free creative director invoice",
      "creative director invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Creative Directors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free creative director invoice template. Professional billing format with customizable fields for creative director services."
  },
  {
    "id": "creative-services",
    "name": "Creative Services",
    "profession": "Creative Services",
    "title": "Creative Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for creative servicess and related service professionals.",
    "keywords": [
      "creative services invoice template",
      "invoice template for creative services",
      "creative services billing template",
      "free creative services invoice",
      "creative services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Creative Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free creative services invoice template. Professional billing format with customizable fields for creative services services."
  },
  {
    "id": "credit-note",
    "name": "Credit Note",
    "profession": "Credit Note",
    "title": "Credit Note Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for credit notes and related business professionals.",
    "keywords": [
      "credit note invoice template",
      "invoice template for credit note",
      "credit note billing template",
      "free credit note invoice",
      "credit note invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Credit Notes typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free credit note invoice template. Professional billing format with customizable fields for credit note services."
  },
  {
    "id": "crm-consultant",
    "name": "Crm Consultant",
    "profession": "Crm Consultant",
    "title": "Crm Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for crm consultants and related business professionals.",
    "keywords": [
      "crm consultant invoice template",
      "invoice template for crm consultant",
      "crm consultant billing template",
      "free crm consultant invoice",
      "crm consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Crm Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free crm consultant invoice template. Professional billing format with customizable fields for crm consultant services."
  },
  {
    "id": "cro-consultant",
    "name": "Cro Consultant",
    "profession": "Cro Consultant",
    "title": "Cro Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cro consultants and related business professionals.",
    "keywords": [
      "cro consultant invoice template",
      "invoice template for cro consultant",
      "cro consultant billing template",
      "free cro consultant invoice",
      "cro consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Cro Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free cro consultant invoice template. Professional billing format with customizable fields for cro consultant services."
  },
  {
    "id": "cybersecurity-consultant",
    "name": "Cybersecurity Consultant",
    "profession": "Cybersecurity Consultant",
    "title": "Cybersecurity Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for cybersecurity consultants and related business professionals.",
    "keywords": [
      "cybersecurity consultant invoice template",
      "invoice template for cybersecurity consultant",
      "cybersecurity consultant billing template",
      "free cybersecurity consultant invoice",
      "cybersecurity consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$50-150",
      "project": "$1000-50000"
    },
    "industryInfo": "Cybersecurity Consultants typically charge between $50-150 per hour depending on experience and project complexity.",
    "seoDescription": "Free cybersecurity consultant invoice template. Professional billing format with customizable fields for cybersecurity consultant services."
  },
  {
    "id": "dance-instructor",
    "name": "Dance Instructor",
    "profession": "Dance Instructor",
    "title": "Dance Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dance instructors and related business professionals.",
    "keywords": [
      "dance instructor invoice template",
      "invoice template for dance instructor",
      "dance instructor billing template",
      "free dance instructor invoice",
      "dance instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dance Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dance instructor invoice template. Professional billing format with customizable fields for dance instructor services."
  },
  {
    "id": "data-analyst",
    "name": "Data Analyst",
    "profession": "Data Analyst",
    "title": "Data Analyst Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for data analysts and related business professionals.",
    "keywords": [
      "data analyst invoice template",
      "invoice template for data analyst",
      "data analyst billing template",
      "free data analyst invoice",
      "data analyst invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Data Analysts typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free data analyst invoice template. Professional billing format with customizable fields for data analyst services."
  },
  {
    "id": "data-scientist",
    "name": "Data Scientist",
    "profession": "Data Scientist",
    "title": "Data Scientist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for data scientists and related business professionals.",
    "keywords": [
      "data scientist invoice template",
      "invoice template for data scientist",
      "data scientist billing template",
      "free data scientist invoice",
      "data scientist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$50-150",
      "project": "$1000-50000"
    },
    "industryInfo": "Data Scientists typically charge between $50-150 per hour depending on experience and project complexity.",
    "seoDescription": "Free data scientist invoice template. Professional billing format with customizable fields for data scientist services."
  },
  {
    "id": "daycare-provider",
    "name": "Daycare Provider",
    "profession": "Daycare Provider",
    "title": "Daycare Provider Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for daycare providers and related business professionals.",
    "keywords": [
      "daycare provider invoice template",
      "invoice template for daycare provider",
      "daycare provider billing template",
      "free daycare provider invoice",
      "daycare provider invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Daycare Providers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free daycare provider invoice template. Professional billing format with customizable fields for daycare provider services."
  },
  {
    "id": "deck-builder",
    "name": "Deck Builder",
    "profession": "Deck Builder",
    "title": "Deck Builder Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for deck builders and related business professionals.",
    "keywords": [
      "deck builder invoice template",
      "invoice template for deck builder",
      "deck builder billing template",
      "free deck builder invoice",
      "deck builder invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Deck Builders typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free deck builder invoice template. Professional billing format with customizable fields for deck builder services."
  },
  {
    "id": "delivery",
    "name": "Delivery",
    "profession": "Delivery",
    "title": "Delivery Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for deliverys and related business professionals.",
    "keywords": [
      "delivery invoice template",
      "invoice template for delivery",
      "delivery billing template",
      "free delivery invoice",
      "delivery invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Deliverys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free delivery invoice template. Professional billing format with customizable fields for delivery services."
  },
  {
    "id": "delivery-service",
    "name": "Delivery Service",
    "profession": "Delivery Service",
    "title": "Delivery Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for delivery services and related service professionals.",
    "keywords": [
      "delivery service invoice template",
      "invoice template for delivery service",
      "delivery service billing template",
      "free delivery service invoice",
      "delivery service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Delivery Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free delivery service invoice template. Professional billing format with customizable fields for delivery service services."
  },
  {
    "id": "demolition",
    "name": "Demolition",
    "profession": "Demolition",
    "title": "Demolition Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for demolitions and related business professionals.",
    "keywords": [
      "demolition invoice template",
      "invoice template for demolition",
      "demolition billing template",
      "free demolition invoice",
      "demolition invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Demolitions typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free demolition invoice template. Professional billing format with customizable fields for demolition services."
  },
  {
    "id": "dental-hygienist",
    "name": "Dental Hygienist",
    "profession": "Dental Hygienist",
    "title": "Dental Hygienist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dental hygienists and related business professionals.",
    "keywords": [
      "dental hygienist invoice template",
      "invoice template for dental hygienist",
      "dental hygienist billing template",
      "free dental hygienist invoice",
      "dental hygienist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dental Hygienists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dental hygienist invoice template. Professional billing format with customizable fields for dental hygienist services."
  },
  {
    "id": "dentist",
    "name": "Dentist",
    "profession": "Dentist",
    "title": "Dentist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dentists and related business professionals.",
    "keywords": [
      "dentist invoice template",
      "invoice template for dentist",
      "dentist billing template",
      "free dentist invoice",
      "dentist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$100-400",
      "project": "$200-5000"
    },
    "industryInfo": "Dentists typically charge between $100-400 per hour depending on experience and project complexity.",
    "seoDescription": "Free dentist invoice template. Professional billing format with customizable fields for dentist services."
  },
  {
    "id": "deposit",
    "name": "Deposit",
    "profession": "Deposit",
    "title": "Deposit Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for deposits and related business professionals.",
    "keywords": [
      "deposit invoice template",
      "invoice template for deposit",
      "deposit billing template",
      "free deposit invoice",
      "deposit invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Deposits typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free deposit invoice template. Professional billing format with customizable fields for deposit services."
  },
  {
    "id": "design-agency",
    "name": "Design Agency",
    "profession": "Design Agency",
    "title": "Design Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for design agencys and related business professionals.",
    "keywords": [
      "design agency invoice template",
      "invoice template for design agency",
      "design agency billing template",
      "free design agency invoice",
      "design agency invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Design Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free design agency invoice template. Professional billing format with customizable fields for design agency services."
  },
  {
    "id": "devops-consultant",
    "name": "Devops Consultant",
    "profession": "Devops Consultant",
    "title": "Devops Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for devops consultants and related business professionals.",
    "keywords": [
      "devops consultant invoice template",
      "invoice template for devops consultant",
      "devops consultant billing template",
      "free devops consultant invoice",
      "devops consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Devops Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free devops consultant invoice template. Professional billing format with customizable fields for devops consultant services."
  },
  {
    "id": "dietitian",
    "name": "Dietitian",
    "profession": "Dietitian",
    "title": "Dietitian Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dietitians and related business professionals.",
    "keywords": [
      "dietitian invoice template",
      "invoice template for dietitian",
      "dietitian billing template",
      "free dietitian invoice",
      "dietitian invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dietitians typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dietitian invoice template. Professional billing format with customizable fields for dietitian services."
  },
  {
    "id": "dj",
    "name": "Dj",
    "profession": "Dj",
    "title": "Dj Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for djs and related business professionals.",
    "keywords": [
      "dj invoice template",
      "invoice template for dj",
      "dj billing template",
      "free dj invoice",
      "dj invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Djs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dj invoice template. Professional billing format with customizable fields for dj services."
  },
  {
    "id": "doctor",
    "name": "Doctor",
    "profession": "Doctor",
    "title": "Doctor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for doctors and related business professionals.",
    "keywords": [
      "doctor invoice template",
      "invoice template for doctor",
      "doctor billing template",
      "free doctor invoice",
      "doctor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$100-400",
      "project": "$200-5000"
    },
    "industryInfo": "Doctors typically charge between $100-400 per hour depending on experience and project complexity.",
    "seoDescription": "Free doctor invoice template. Professional billing format with customizable fields for doctor services."
  },
  {
    "id": "dog-trainer",
    "name": "Dog Trainer",
    "profession": "Dog Trainer",
    "title": "Dog Trainer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dog trainers and related business professionals.",
    "keywords": [
      "dog trainer invoice template",
      "invoice template for dog trainer",
      "dog trainer billing template",
      "free dog trainer invoice",
      "dog trainer invoice format"
    ],
    "commonServices": [
      "Personal training",
      "Group classes",
      "Nutrition coaching",
      "Program design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dog Trainers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dog trainer invoice template. Professional billing format with customizable fields for dog trainer services."
  },
  {
    "id": "dog-walker",
    "name": "Dog Walker",
    "profession": "Dog Walker",
    "title": "Dog Walker Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dog walkers and related business professionals.",
    "keywords": [
      "dog walker invoice template",
      "invoice template for dog walker",
      "dog walker billing template",
      "free dog walker invoice",
      "dog walker invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dog Walkers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dog walker invoice template. Professional billing format with customizable fields for dog walker services."
  },
  {
    "id": "door-installer",
    "name": "Door Installer",
    "profession": "Door Installer",
    "title": "Door Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for door installers and related business professionals.",
    "keywords": [
      "door installer invoice template",
      "invoice template for door installer",
      "door installer billing template",
      "free door installer invoice",
      "door installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Door Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free door installer invoice template. Professional billing format with customizable fields for door installer services."
  },
  {
    "id": "doula",
    "name": "Doula",
    "profession": "Doula",
    "title": "Doula Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for doulas and related business professionals.",
    "keywords": [
      "doula invoice template",
      "invoice template for doula",
      "doula billing template",
      "free doula invoice",
      "doula invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Doulas typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free doula invoice template. Professional billing format with customizable fields for doula services."
  },
  {
    "id": "driving-instructor",
    "name": "Driving Instructor",
    "profession": "Driving Instructor",
    "title": "Driving Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for driving instructors and related business professionals.",
    "keywords": [
      "driving instructor invoice template",
      "invoice template for driving instructor",
      "driving instructor billing template",
      "free driving instructor invoice",
      "driving instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Driving Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free driving instructor invoice template. Professional billing format with customizable fields for driving instructor services."
  },
  {
    "id": "drone-photographer",
    "name": "Drone Photographer",
    "profession": "Drone Photographer",
    "title": "Drone Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for drone photographers and related business professionals.",
    "keywords": [
      "drone photographer invoice template",
      "invoice template for drone photographer",
      "drone photographer billing template",
      "free drone photographer invoice",
      "drone photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Drone Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free drone photographer invoice template. Professional billing format with customizable fields for drone photographer services."
  },
  {
    "id": "dropshipping",
    "name": "Dropshipping",
    "profession": "Dropshipping",
    "title": "Dropshipping Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dropshippings and related business professionals.",
    "keywords": [
      "dropshipping invoice template",
      "invoice template for dropshipping",
      "dropshipping billing template",
      "free dropshipping invoice",
      "dropshipping invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dropshippings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dropshipping invoice template. Professional billing format with customizable fields for dropshipping services."
  },
  {
    "id": "dryer-vent-cleaning",
    "name": "Dryer Vent Cleaning",
    "profession": "Dryer Vent Cleaning",
    "title": "Dryer Vent Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for dryer vent cleanings and related business professionals.",
    "keywords": [
      "dryer vent cleaning invoice template",
      "invoice template for dryer vent cleaning",
      "dryer vent cleaning billing template",
      "free dryer vent cleaning invoice",
      "dryer vent cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Dryer Vent Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free dryer vent cleaning invoice template. Professional billing format with customizable fields for dryer vent cleaning services."
  },
  {
    "id": "drywall-installer",
    "name": "Drywall Installer",
    "profession": "Drywall Installer",
    "title": "Drywall Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for drywall installers and related business professionals.",
    "keywords": [
      "drywall installer invoice template",
      "invoice template for drywall installer",
      "drywall installer billing template",
      "free drywall installer invoice",
      "drywall installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Drywall Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free drywall installer invoice template. Professional billing format with customizable fields for drywall installer services."
  },
  {
    "id": "ebay-seller",
    "name": "Ebay Seller",
    "profession": "Ebay Seller",
    "title": "Ebay Seller Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for ebay sellers and related business professionals.",
    "keywords": [
      "ebay seller invoice template",
      "invoice template for ebay seller",
      "ebay seller billing template",
      "free ebay seller invoice",
      "ebay seller invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Ebay Sellers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free ebay seller invoice template. Professional billing format with customizable fields for ebay seller services."
  },
  {
    "id": "education",
    "name": "Education",
    "profession": "Education",
    "title": "Education Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for educations and related business professionals.",
    "keywords": [
      "education invoice template",
      "invoice template for education",
      "education billing template",
      "free education invoice",
      "education invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Educations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free education invoice template. Professional billing format with customizable fields for education services."
  },
  {
    "id": "electrical-contractor",
    "name": "Electrical Contractor",
    "profession": "Electrical Contractor",
    "title": "Electrical Contractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for electrical contractors and related business professionals.",
    "keywords": [
      "electrical contractor invoice template",
      "invoice template for electrical contractor",
      "electrical contractor billing template",
      "free electrical contractor invoice",
      "electrical contractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Electrical Contractors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free electrical contractor invoice template. Professional billing format with customizable fields for electrical contractor services."
  },
  {
    "id": "electrical-inspection",
    "name": "Electrical Inspection",
    "profession": "Electrical Inspection",
    "title": "Electrical Inspection Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for electrical inspections and related business professionals.",
    "keywords": [
      "electrical inspection invoice template",
      "invoice template for electrical inspection",
      "electrical inspection billing template",
      "free electrical inspection invoice",
      "electrical inspection invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Electrical Inspections typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free electrical inspection invoice template. Professional billing format with customizable fields for electrical inspection services."
  },
  {
    "id": "electrician",
    "name": "Electrician",
    "profession": "Electrician",
    "title": "Electrician Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for electricians and related business professionals.",
    "keywords": [
      "electrician invoice template",
      "invoice template for electrician",
      "electrician billing template",
      "free electrician invoice",
      "electrician invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Electricians typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free electrician invoice template. Professional billing format with customizable fields for electrician services."
  },
  {
    "id": "email-marketing-specialist",
    "name": "Email Marketing Specialist",
    "profession": "Email Marketing Specialist",
    "title": "Email Marketing Specialist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for email marketing specialists and related business professionals.",
    "keywords": [
      "email marketing specialist invoice template",
      "invoice template for email marketing specialist",
      "email marketing specialist billing template",
      "free email marketing specialist invoice",
      "email marketing specialist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Email Marketing Specialists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free email marketing specialist invoice template. Professional billing format with customizable fields for email marketing specialist services."
  },
  {
    "id": "energy-auditor",
    "name": "Energy Auditor",
    "profession": "Energy Auditor",
    "title": "Energy Auditor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for energy auditors and related business professionals.",
    "keywords": [
      "energy auditor invoice template",
      "invoice template for energy auditor",
      "energy auditor billing template",
      "free energy auditor invoice",
      "energy auditor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Energy Auditors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free energy auditor invoice template. Professional billing format with customizable fields for energy auditor services."
  },
  {
    "id": "engraving-service",
    "name": "Engraving Service",
    "profession": "Engraving Service",
    "title": "Engraving Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for engraving services and related service professionals.",
    "keywords": [
      "engraving service invoice template",
      "invoice template for engraving service",
      "engraving service billing template",
      "free engraving service invoice",
      "engraving service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Engraving Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free engraving service invoice template. Professional billing format with customizable fields for engraving service services."
  },
  {
    "id": "enrolled-agent",
    "name": "Enrolled Agent",
    "profession": "Enrolled Agent",
    "title": "Enrolled Agent Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for enrolled agents and related business professionals.",
    "keywords": [
      "enrolled agent invoice template",
      "invoice template for enrolled agent",
      "enrolled agent billing template",
      "free enrolled agent invoice",
      "enrolled agent invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Enrolled Agents typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free enrolled agent invoice template. Professional billing format with customizable fields for enrolled agent services."
  },
  {
    "id": "entertainment",
    "name": "Entertainment",
    "profession": "Entertainment",
    "title": "Entertainment Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for entertainments and related business professionals.",
    "keywords": [
      "entertainment invoice template",
      "invoice template for entertainment",
      "entertainment billing template",
      "free entertainment invoice",
      "entertainment invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Entertainments typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free entertainment invoice template. Professional billing format with customizable fields for entertainment services."
  },
  {
    "id": "equipment-operator",
    "name": "Equipment Operator",
    "profession": "Equipment Operator",
    "title": "Equipment Operator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for equipment operators and related business professionals.",
    "keywords": [
      "equipment operator invoice template",
      "invoice template for equipment operator",
      "equipment operator billing template",
      "free equipment operator invoice",
      "equipment operator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Equipment Operators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free equipment operator invoice template. Professional billing format with customizable fields for equipment operator services."
  },
  {
    "id": "equipment-rental",
    "name": "Equipment Rental",
    "profession": "Equipment Rental",
    "title": "Equipment Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for equipment rentals and related business professionals.",
    "keywords": [
      "equipment rental invoice template",
      "invoice template for equipment rental",
      "equipment rental billing template",
      "free equipment rental invoice",
      "equipment rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Equipment Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free equipment rental invoice template. Professional billing format with customizable fields for equipment rental services."
  },
  {
    "id": "esl-teacher",
    "name": "Esl Teacher",
    "profession": "Esl Teacher",
    "title": "Esl Teacher Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for esl teachers and related business professionals.",
    "keywords": [
      "esl teacher invoice template",
      "invoice template for esl teacher",
      "esl teacher billing template",
      "free esl teacher invoice",
      "esl teacher invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Esl Teachers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free esl teacher invoice template. Professional billing format with customizable fields for esl teacher services."
  },
  {
    "id": "esthetician",
    "name": "Esthetician",
    "profession": "Esthetician",
    "title": "Esthetician Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for estheticians and related business professionals.",
    "keywords": [
      "esthetician invoice template",
      "invoice template for esthetician",
      "esthetician billing template",
      "free esthetician invoice",
      "esthetician invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Estheticians typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free esthetician invoice template. Professional billing format with customizable fields for esthetician services."
  },
  {
    "id": "etsy-seller",
    "name": "Etsy Seller",
    "profession": "Etsy Seller",
    "title": "Etsy Seller Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for etsy sellers and related business professionals.",
    "keywords": [
      "etsy seller invoice template",
      "invoice template for etsy seller",
      "etsy seller billing template",
      "free etsy seller invoice",
      "etsy seller invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Etsy Sellers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free etsy seller invoice template. Professional billing format with customizable fields for etsy seller services."
  },
  {
    "id": "event-decorator",
    "name": "Event Decorator",
    "profession": "Event Decorator",
    "title": "Event Decorator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for event decorators and related business professionals.",
    "keywords": [
      "event decorator invoice template",
      "invoice template for event decorator",
      "event decorator billing template",
      "free event decorator invoice",
      "event decorator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Event Decorators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free event decorator invoice template. Professional billing format with customizable fields for event decorator services."
  },
  {
    "id": "event-photographer",
    "name": "Event Photographer",
    "profession": "Event Photographer",
    "title": "Event Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for event photographers and related business professionals.",
    "keywords": [
      "event photographer invoice template",
      "invoice template for event photographer",
      "event photographer billing template",
      "free event photographer invoice",
      "event photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Event Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free event photographer invoice template. Professional billing format with customizable fields for event photographer services."
  },
  {
    "id": "event-planner",
    "name": "Event Planner",
    "profession": "Event Planner",
    "title": "Event Planner Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for event planners and related business professionals.",
    "keywords": [
      "event planner invoice template",
      "invoice template for event planner",
      "event planner billing template",
      "free event planner invoice",
      "event planner invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Event Planners typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free event planner invoice template. Professional billing format with customizable fields for event planner services."
  },
  {
    "id": "event-rental",
    "name": "Event Rental",
    "profession": "Event Rental",
    "title": "Event Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for event rentals and related business professionals.",
    "keywords": [
      "event rental invoice template",
      "invoice template for event rental",
      "event rental billing template",
      "free event rental invoice",
      "event rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Event Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free event rental invoice template. Professional billing format with customizable fields for event rental services."
  },
  {
    "id": "excavation",
    "name": "Excavation",
    "profession": "Excavation",
    "title": "Excavation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for excavations and related business professionals.",
    "keywords": [
      "excavation invoice template",
      "invoice template for excavation",
      "excavation billing template",
      "free excavation invoice",
      "excavation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Excavations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free excavation invoice template. Professional billing format with customizable fields for excavation services."
  },
  {
    "id": "executive-coach",
    "name": "Executive Coach",
    "profession": "Executive Coach",
    "title": "Executive Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for executive coachs and related business professionals.",
    "keywords": [
      "executive coach invoice template",
      "invoice template for executive coach",
      "executive coach billing template",
      "free executive coach invoice",
      "executive coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Executive Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free executive coach invoice template. Professional billing format with customizable fields for executive coach services."
  },
  {
    "id": "facebook-ads-manager",
    "name": "Facebook Ads Manager",
    "profession": "Facebook Ads Manager",
    "title": "Facebook Ads Manager Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for facebook ads managers and related business professionals.",
    "keywords": [
      "facebook ads manager invoice template",
      "invoice template for facebook ads manager",
      "facebook ads manager billing template",
      "free facebook ads manager invoice",
      "facebook ads manager invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Facebook Ads Managers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free facebook ads manager invoice template. Professional billing format with customizable fields for facebook ads manager services."
  },
  {
    "id": "farrier",
    "name": "Farrier",
    "profession": "Farrier",
    "title": "Farrier Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for farriers and related business professionals.",
    "keywords": [
      "farrier invoice template",
      "invoice template for farrier",
      "farrier billing template",
      "free farrier invoice",
      "farrier invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Farriers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free farrier invoice template. Professional billing format with customizable fields for farrier services."
  },
  {
    "id": "fashion-designer",
    "name": "Fashion Designer",
    "profession": "Fashion Designer",
    "title": "Fashion Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for fashion designers and related business professionals.",
    "keywords": [
      "fashion designer invoice template",
      "invoice template for fashion designer",
      "fashion designer billing template",
      "free fashion designer invoice",
      "fashion designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Fashion Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free fashion designer invoice template. Professional billing format with customizable fields for fashion designer services."
  },
  {
    "id": "fence-installer",
    "name": "Fence Installer",
    "profession": "Fence Installer",
    "title": "Fence Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for fence installers and related business professionals.",
    "keywords": [
      "fence installer invoice template",
      "invoice template for fence installer",
      "fence installer billing template",
      "free fence installer invoice",
      "fence installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Fence Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free fence installer invoice template. Professional billing format with customizable fields for fence installer services."
  },
  {
    "id": "financial-advisor",
    "name": "Financial Advisor",
    "profession": "Financial Advisor",
    "title": "Financial Advisor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for financial advisors and related business professionals.",
    "keywords": [
      "financial advisor invoice template",
      "invoice template for financial advisor",
      "financial advisor billing template",
      "free financial advisor invoice",
      "financial advisor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$75-300",
      "project": "$2000-100000"
    },
    "industryInfo": "Financial Advisors typically charge between $75-300 per hour depending on experience and project complexity.",
    "seoDescription": "Free financial advisor invoice template. Professional billing format with customizable fields for financial advisor services."
  },
  {
    "id": "financial-consultant",
    "name": "Financial Consultant",
    "profession": "Financial Consultant",
    "title": "Financial Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for financial consultants and related business professionals.",
    "keywords": [
      "financial consultant invoice template",
      "invoice template for financial consultant",
      "financial consultant billing template",
      "free financial consultant invoice",
      "financial consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Financial Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free financial consultant invoice template. Professional billing format with customizable fields for financial consultant services."
  },
  {
    "id": "financial-planner",
    "name": "Financial Planner",
    "profession": "Financial Planner",
    "title": "Financial Planner Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for financial planners and related business professionals.",
    "keywords": [
      "financial planner invoice template",
      "invoice template for financial planner",
      "financial planner billing template",
      "free financial planner invoice",
      "financial planner invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Financial Planners typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free financial planner invoice template. Professional billing format with customizable fields for financial planner services."
  },
  {
    "id": "fitness-coach",
    "name": "Fitness Coach",
    "profession": "Fitness Coach",
    "title": "Fitness Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for fitness coachs and related business professionals.",
    "keywords": [
      "fitness coach invoice template",
      "invoice template for fitness coach",
      "fitness coach billing template",
      "free fitness coach invoice",
      "fitness coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Fitness Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free fitness coach invoice template. Professional billing format with customizable fields for fitness coach services."
  },
  {
    "id": "flooring",
    "name": "Flooring",
    "profession": "Flooring",
    "title": "Flooring Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for floorings and related business professionals.",
    "keywords": [
      "flooring invoice template",
      "invoice template for flooring",
      "flooring billing template",
      "free flooring invoice",
      "flooring invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Floorings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free flooring invoice template. Professional billing format with customizable fields for flooring services."
  },
  {
    "id": "florist",
    "name": "Florist",
    "profession": "Florist",
    "title": "Florist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for florists and related business professionals.",
    "keywords": [
      "florist invoice template",
      "invoice template for florist",
      "florist billing template",
      "free florist invoice",
      "florist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Florists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free florist invoice template. Professional billing format with customizable fields for florist services."
  },
  {
    "id": "food-delivery",
    "name": "Food Delivery",
    "profession": "Food Delivery",
    "title": "Food Delivery Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for food deliverys and related business professionals.",
    "keywords": [
      "food delivery invoice template",
      "invoice template for food delivery",
      "food delivery billing template",
      "free food delivery invoice",
      "food delivery invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Food Deliverys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free food delivery invoice template. Professional billing format with customizable fields for food delivery services."
  },
  {
    "id": "food-photographer",
    "name": "Food Photographer",
    "profession": "Food Photographer",
    "title": "Food Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for food photographers and related business professionals.",
    "keywords": [
      "food photographer invoice template",
      "invoice template for food photographer",
      "food photographer billing template",
      "free food photographer invoice",
      "food photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Food Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free food photographer invoice template. Professional billing format with customizable fields for food photographer services."
  },
  {
    "id": "food-truck",
    "name": "Food Truck",
    "profession": "Food Truck",
    "title": "Food Truck Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for food trucks and related business professionals.",
    "keywords": [
      "food truck invoice template",
      "invoice template for food truck",
      "food truck billing template",
      "free food truck invoice",
      "food truck invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Food Trucks typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free food truck invoice template. Professional billing format with customizable fields for food truck services."
  },
  {
    "id": "forklift-operator",
    "name": "Forklift Operator",
    "profession": "Forklift Operator",
    "title": "Forklift Operator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for forklift operators and related business professionals.",
    "keywords": [
      "forklift operator invoice template",
      "invoice template for forklift operator",
      "forklift operator billing template",
      "free forklift operator invoice",
      "forklift operator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Forklift Operators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free forklift operator invoice template. Professional billing format with customizable fields for forklift operator services."
  },
  {
    "id": "foundation-repair",
    "name": "Foundation Repair",
    "profession": "Foundation Repair",
    "title": "Foundation Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for foundation repairs and related business professionals.",
    "keywords": [
      "foundation repair invoice template",
      "invoice template for foundation repair",
      "foundation repair billing template",
      "free foundation repair invoice",
      "foundation repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Foundation Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free foundation repair invoice template. Professional billing format with customizable fields for foundation repair services."
  },
  {
    "id": "freelance",
    "name": "Freelance",
    "profession": "Freelance",
    "title": "Freelance Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for freelances and related business professionals.",
    "keywords": [
      "freelance invoice template",
      "invoice template for freelance",
      "freelance billing template",
      "free freelance invoice",
      "freelance invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Freelances typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free freelance invoice template. Professional billing format with customizable fields for freelance services."
  },
  {
    "id": "freelancer",
    "name": "Freelancer",
    "profession": "Freelancer",
    "title": "Freelancer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for freelancers and related business professionals.",
    "keywords": [
      "freelancer invoice template",
      "invoice template for freelancer",
      "freelancer billing template",
      "free freelancer invoice",
      "freelancer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Freelancers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free freelancer invoice template. Professional billing format with customizable fields for freelancer services."
  },
  {
    "id": "freight",
    "name": "Freight",
    "profession": "Freight",
    "title": "Freight Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for freights and related business professionals.",
    "keywords": [
      "freight invoice template",
      "invoice template for freight",
      "freight billing template",
      "free freight invoice",
      "freight invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Freights typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free freight invoice template. Professional billing format with customizable fields for freight services."
  },
  {
    "id": "furniture-assembly",
    "name": "Furniture Assembly",
    "profession": "Furniture Assembly",
    "title": "Furniture Assembly Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for furniture assemblys and related business professionals.",
    "keywords": [
      "furniture assembly invoice template",
      "invoice template for furniture assembly",
      "furniture assembly billing template",
      "free furniture assembly invoice",
      "furniture assembly invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Furniture Assemblys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free furniture assembly invoice template. Professional billing format with customizable fields for furniture assembly services."
  },
  {
    "id": "garage-door-repair",
    "name": "Garage Door Repair",
    "profession": "Garage Door Repair",
    "title": "Garage Door Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for garage door repairs and related business professionals.",
    "keywords": [
      "garage door repair invoice template",
      "invoice template for garage door repair",
      "garage door repair billing template",
      "free garage door repair invoice",
      "garage door repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Garage Door Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free garage door repair invoice template. Professional billing format with customizable fields for garage door repair services."
  },
  {
    "id": "gardening",
    "name": "Gardening",
    "profession": "Gardening",
    "title": "Gardening Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for gardenings and related business professionals.",
    "keywords": [
      "gardening invoice template",
      "invoice template for gardening",
      "gardening billing template",
      "free gardening invoice",
      "gardening invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Gardenings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free gardening invoice template. Professional billing format with customizable fields for gardening services."
  },
  {
    "id": "general-contractor",
    "name": "General Contractor",
    "profession": "General Contractor",
    "title": "General Contractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for general contractors and related business professionals.",
    "keywords": [
      "general contractor invoice template",
      "invoice template for general contractor",
      "general contractor billing template",
      "free general contractor invoice",
      "general contractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "General Contractors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free general contractor invoice template. Professional billing format with customizable fields for general contractor services."
  },
  {
    "id": "generator-installation",
    "name": "Generator Installation",
    "profession": "Generator Installation",
    "title": "Generator Installation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for generator installations and related business professionals.",
    "keywords": [
      "generator installation invoice template",
      "invoice template for generator installation",
      "generator installation billing template",
      "free generator installation invoice",
      "generator installation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Generator Installations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free generator installation invoice template. Professional billing format with customizable fields for generator installation services."
  },
  {
    "id": "golf-coach",
    "name": "Golf Coach",
    "profession": "Golf Coach",
    "title": "Golf Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for golf coachs and related business professionals.",
    "keywords": [
      "golf coach invoice template",
      "invoice template for golf coach",
      "golf coach billing template",
      "free golf coach invoice",
      "golf coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Golf Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free golf coach invoice template. Professional billing format with customizable fields for golf coach services."
  },
  {
    "id": "google-ads-specialist",
    "name": "Google Ads Specialist",
    "profession": "Google Ads Specialist",
    "title": "Google Ads Specialist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for google ads specialists and related business professionals.",
    "keywords": [
      "google ads specialist invoice template",
      "invoice template for google ads specialist",
      "google ads specialist billing template",
      "free google ads specialist invoice",
      "google ads specialist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Google Ads Specialists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free google ads specialist invoice template. Professional billing format with customizable fields for google ads specialist services."
  },
  {
    "id": "grant-writer",
    "name": "Grant Writer",
    "profession": "Grant Writer",
    "title": "Grant Writer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for grant writers and related business professionals.",
    "keywords": [
      "grant writer invoice template",
      "invoice template for grant writer",
      "grant writer billing template",
      "free grant writer invoice",
      "grant writer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Grant Writers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free grant writer invoice template. Professional billing format with customizable fields for grant writer services."
  },
  {
    "id": "graphic-designer",
    "name": "Graphic Designer",
    "profession": "Graphic Designer",
    "title": "Graphic Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for graphic designers and related business professionals.",
    "keywords": [
      "graphic designer invoice template",
      "invoice template for graphic designer",
      "graphic designer billing template",
      "free graphic designer invoice",
      "graphic designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$35-100",
      "project": "$500-10000"
    },
    "industryInfo": "Graphic Designers typically charge between $35-100 per hour depending on experience and project complexity.",
    "seoDescription": "Free graphic designer invoice template. Professional billing format with customizable fields for graphic designer services."
  },
  {
    "id": "grout-cleaning",
    "name": "Grout Cleaning",
    "profession": "Grout Cleaning",
    "title": "Grout Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for grout cleanings and related business professionals.",
    "keywords": [
      "grout cleaning invoice template",
      "invoice template for grout cleaning",
      "grout cleaning billing template",
      "free grout cleaning invoice",
      "grout cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Grout Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free grout cleaning invoice template. Professional billing format with customizable fields for grout cleaning services."
  },
  {
    "id": "guitar-teacher",
    "name": "Guitar Teacher",
    "profession": "Guitar Teacher",
    "title": "Guitar Teacher Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for guitar teachers and related business professionals.",
    "keywords": [
      "guitar teacher invoice template",
      "invoice template for guitar teacher",
      "guitar teacher billing template",
      "free guitar teacher invoice",
      "guitar teacher invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Guitar Teachers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free guitar teacher invoice template. Professional billing format with customizable fields for guitar teacher services."
  },
  {
    "id": "gutter-cleaning",
    "name": "Gutter Cleaning",
    "profession": "Gutter Cleaning",
    "title": "Gutter Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for gutter cleanings and related business professionals.",
    "keywords": [
      "gutter cleaning invoice template",
      "invoice template for gutter cleaning",
      "gutter cleaning billing template",
      "free gutter cleaning invoice",
      "gutter cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Gutter Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free gutter cleaning invoice template. Professional billing format with customizable fields for gutter cleaning services."
  },
  {
    "id": "gutter-installer",
    "name": "Gutter Installer",
    "profession": "Gutter Installer",
    "title": "Gutter Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for gutter installers and related business professionals.",
    "keywords": [
      "gutter installer invoice template",
      "invoice template for gutter installer",
      "gutter installer billing template",
      "free gutter installer invoice",
      "gutter installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Gutter Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free gutter installer invoice template. Professional billing format with customizable fields for gutter installer services."
  },
  {
    "id": "hair-stylist",
    "name": "Hair Stylist",
    "profession": "Hair Stylist",
    "title": "Hair Stylist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hair stylists and related business professionals.",
    "keywords": [
      "hair stylist invoice template",
      "invoice template for hair stylist",
      "hair stylist billing template",
      "free hair stylist invoice",
      "hair stylist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hair Stylists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hair stylist invoice template. Professional billing format with customizable fields for hair stylist services."
  },
  {
    "id": "handyman",
    "name": "Handyman",
    "profession": "Handyman",
    "title": "Handyman Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for handymans and related business professionals.",
    "keywords": [
      "handyman invoice template",
      "invoice template for handyman",
      "handyman billing template",
      "free handyman invoice",
      "handyman invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$25-75",
      "project": "$100-5000"
    },
    "industryInfo": "Handymans typically charge between $25-75 per hour depending on experience and project complexity.",
    "seoDescription": "Free handyman invoice template. Professional billing format with customizable fields for handyman services."
  },
  {
    "id": "hardscaping",
    "name": "Hardscaping",
    "profession": "Hardscaping",
    "title": "Hardscaping Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hardscapings and related business professionals.",
    "keywords": [
      "hardscaping invoice template",
      "invoice template for hardscaping",
      "hardscaping billing template",
      "free hardscaping invoice",
      "hardscaping invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hardscapings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hardscaping invoice template. Professional billing format with customizable fields for hardscaping services."
  },
  {
    "id": "hauling",
    "name": "Hauling",
    "profession": "Hauling",
    "title": "Hauling Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for haulings and related business professionals.",
    "keywords": [
      "hauling invoice template",
      "invoice template for hauling",
      "hauling billing template",
      "free hauling invoice",
      "hauling invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Haulings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hauling invoice template. Professional billing format with customizable fields for hauling services."
  },
  {
    "id": "healthcare",
    "name": "Healthcare",
    "profession": "Healthcare",
    "title": "Healthcare Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for healthcares and related business professionals.",
    "keywords": [
      "healthcare invoice template",
      "invoice template for healthcare",
      "healthcare billing template",
      "free healthcare invoice",
      "healthcare invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Healthcares typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free healthcare invoice template. Professional billing format with customizable fields for healthcare services."
  },
  {
    "id": "herbalist",
    "name": "Herbalist",
    "profession": "Herbalist",
    "title": "Herbalist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for herbalists and related business professionals.",
    "keywords": [
      "herbalist invoice template",
      "invoice template for herbalist",
      "herbalist billing template",
      "free herbalist invoice",
      "herbalist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Herbalists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free herbalist invoice template. Professional billing format with customizable fields for herbalist services."
  },
  {
    "id": "holiday-lighting-installer",
    "name": "Holiday Lighting Installer",
    "profession": "Holiday Lighting Installer",
    "title": "Holiday Lighting Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for holiday lighting installers and related business professionals.",
    "keywords": [
      "holiday lighting installer invoice template",
      "invoice template for holiday lighting installer",
      "holiday lighting installer billing template",
      "free holiday lighting installer invoice",
      "holiday lighting installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Holiday Lighting Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free holiday lighting installer invoice template. Professional billing format with customizable fields for holiday lighting installer services."
  },
  {
    "id": "home-appraiser",
    "name": "Home Appraiser",
    "profession": "Home Appraiser",
    "title": "Home Appraiser Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for home appraisers and related business professionals.",
    "keywords": [
      "home appraiser invoice template",
      "invoice template for home appraiser",
      "home appraiser billing template",
      "free home appraiser invoice",
      "home appraiser invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Home Appraisers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free home appraiser invoice template. Professional billing format with customizable fields for home appraiser services."
  },
  {
    "id": "home-health-aide",
    "name": "Home Health Aide",
    "profession": "Home Health Aide",
    "title": "Home Health Aide Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for home health aides and related business professionals.",
    "keywords": [
      "home health aide invoice template",
      "invoice template for home health aide",
      "home health aide billing template",
      "free home health aide invoice",
      "home health aide invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Home Health Aides typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free home health aide invoice template. Professional billing format with customizable fields for home health aide services."
  },
  {
    "id": "home-inspector",
    "name": "Home Inspector",
    "profession": "Home Inspector",
    "title": "Home Inspector Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for home inspectors and related business professionals.",
    "keywords": [
      "home inspector invoice template",
      "invoice template for home inspector",
      "home inspector billing template",
      "free home inspector invoice",
      "home inspector invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Home Inspectors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free home inspector invoice template. Professional billing format with customizable fields for home inspector services."
  },
  {
    "id": "home-organizer",
    "name": "Home Organizer",
    "profession": "Home Organizer",
    "title": "Home Organizer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for home organizers and related business professionals.",
    "keywords": [
      "home organizer invoice template",
      "invoice template for home organizer",
      "home organizer billing template",
      "free home organizer invoice",
      "home organizer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Home Organizers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free home organizer invoice template. Professional billing format with customizable fields for home organizer services."
  },
  {
    "id": "home-repair",
    "name": "Home Repair",
    "profession": "Home Repair",
    "title": "Home Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for home repairs and related business professionals.",
    "keywords": [
      "home repair invoice template",
      "invoice template for home repair",
      "home repair billing template",
      "free home repair invoice",
      "home repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Home Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free home repair invoice template. Professional billing format with customizable fields for home repair services."
  },
  {
    "id": "home-staging",
    "name": "Home Staging",
    "profession": "Home Staging",
    "title": "Home Staging Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for home stagings and related business professionals.",
    "keywords": [
      "home staging invoice template",
      "invoice template for home staging",
      "home staging billing template",
      "free home staging invoice",
      "home staging invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Home Stagings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free home staging invoice template. Professional billing format with customizable fields for home staging services."
  },
  {
    "id": "horse-trainer",
    "name": "Horse Trainer",
    "profession": "Horse Trainer",
    "title": "Horse Trainer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for horse trainers and related business professionals.",
    "keywords": [
      "horse trainer invoice template",
      "invoice template for horse trainer",
      "horse trainer billing template",
      "free horse trainer invoice",
      "horse trainer invoice format"
    ],
    "commonServices": [
      "Personal training",
      "Group classes",
      "Nutrition coaching",
      "Program design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Horse Trainers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free horse trainer invoice template. Professional billing format with customizable fields for horse trainer services."
  },
  {
    "id": "hospitality",
    "name": "Hospitality",
    "profession": "Hospitality",
    "title": "Hospitality Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hospitalitys and related business professionals.",
    "keywords": [
      "hospitality invoice template",
      "invoice template for hospitality",
      "hospitality billing template",
      "free hospitality invoice",
      "hospitality invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hospitalitys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hospitality invoice template. Professional billing format with customizable fields for hospitality services."
  },
  {
    "id": "house-cleaning",
    "name": "House Cleaning",
    "profession": "House Cleaning",
    "title": "House Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for house cleanings and related business professionals.",
    "keywords": [
      "house cleaning invoice template",
      "invoice template for house cleaning",
      "house cleaning billing template",
      "free house cleaning invoice",
      "house cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "House Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free house cleaning invoice template. Professional billing format with customizable fields for house cleaning services."
  },
  {
    "id": "hr-consultant",
    "name": "Hr Consultant",
    "profession": "Hr Consultant",
    "title": "Hr Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hr consultants and related business professionals.",
    "keywords": [
      "hr consultant invoice template",
      "invoice template for hr consultant",
      "hr consultant billing template",
      "free hr consultant invoice",
      "hr consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hr Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hr consultant invoice template. Professional billing format with customizable fields for hr consultant services."
  },
  {
    "id": "hr-services",
    "name": "Hr Services",
    "profession": "Hr Services",
    "title": "Hr Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hr servicess and related service professionals.",
    "keywords": [
      "hr services invoice template",
      "invoice template for hr services",
      "hr services billing template",
      "free hr services invoice",
      "hr services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hr Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hr services invoice template. Professional billing format with customizable fields for hr services services."
  },
  {
    "id": "hubspot-consultant",
    "name": "Hubspot Consultant",
    "profession": "Hubspot Consultant",
    "title": "Hubspot Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hubspot consultants and related business professionals.",
    "keywords": [
      "hubspot consultant invoice template",
      "invoice template for hubspot consultant",
      "hubspot consultant billing template",
      "free hubspot consultant invoice",
      "hubspot consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hubspot Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hubspot consultant invoice template. Professional billing format with customizable fields for hubspot consultant services."
  },
  {
    "id": "hvac",
    "name": "Hvac",
    "profession": "Hvac",
    "title": "Hvac Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for hvacs and related business professionals.",
    "keywords": [
      "hvac invoice template",
      "invoice template for hvac",
      "hvac billing template",
      "free hvac invoice",
      "hvac invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Hvacs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free hvac invoice template. Professional billing format with customizable fields for hvac services."
  },
  {
    "id": "illustration",
    "name": "Illustration",
    "profession": "Illustration",
    "title": "Illustration Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for illustrations and related business professionals.",
    "keywords": [
      "illustration invoice template",
      "invoice template for illustration",
      "illustration billing template",
      "free illustration invoice",
      "illustration invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Illustrations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free illustration invoice template. Professional billing format with customizable fields for illustration services."
  },
  {
    "id": "immigration-consultant",
    "name": "Immigration Consultant",
    "profession": "Immigration Consultant",
    "title": "Immigration Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for immigration consultants and related business professionals.",
    "keywords": [
      "immigration consultant invoice template",
      "invoice template for immigration consultant",
      "immigration consultant billing template",
      "free immigration consultant invoice",
      "immigration consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Immigration Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free immigration consultant invoice template. Professional billing format with customizable fields for immigration consultant services."
  },
  {
    "id": "industrial-cleaning",
    "name": "Industrial Cleaning",
    "profession": "Industrial Cleaning",
    "title": "Industrial Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for industrial cleanings and related business professionals.",
    "keywords": [
      "industrial cleaning invoice template",
      "invoice template for industrial cleaning",
      "industrial cleaning billing template",
      "free industrial cleaning invoice",
      "industrial cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Industrial Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free industrial cleaning invoice template. Professional billing format with customizable fields for industrial cleaning services."
  },
  {
    "id": "influencer",
    "name": "Influencer",
    "profession": "Influencer",
    "title": "Influencer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for influencers and related business professionals.",
    "keywords": [
      "influencer invoice template",
      "invoice template for influencer",
      "influencer billing template",
      "free influencer invoice",
      "influencer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Influencers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free influencer invoice template. Professional billing format with customizable fields for influencer services."
  },
  {
    "id": "insulation-contractor",
    "name": "Insulation Contractor",
    "profession": "Insulation Contractor",
    "title": "Insulation Contractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for insulation contractors and related business professionals.",
    "keywords": [
      "insulation contractor invoice template",
      "invoice template for insulation contractor",
      "insulation contractor billing template",
      "free insulation contractor invoice",
      "insulation contractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Insulation Contractors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free insulation contractor invoice template. Professional billing format with customizable fields for insulation contractor services."
  },
  {
    "id": "insurance-agent",
    "name": "Insurance Agent",
    "profession": "Insurance Agent",
    "title": "Insurance Agent Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for insurance agents and related business professionals.",
    "keywords": [
      "insurance agent invoice template",
      "invoice template for insurance agent",
      "insurance agent billing template",
      "free insurance agent invoice",
      "insurance agent invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Insurance Agents typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free insurance agent invoice template. Professional billing format with customizable fields for insurance agent services."
  },
  {
    "id": "interior-decorator",
    "name": "Interior Decorator",
    "profession": "Interior Decorator",
    "title": "Interior Decorator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for interior decorators and related business professionals.",
    "keywords": [
      "interior decorator invoice template",
      "invoice template for interior decorator",
      "interior decorator billing template",
      "free interior decorator invoice",
      "interior decorator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Interior Decorators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free interior decorator invoice template. Professional billing format with customizable fields for interior decorator services."
  },
  {
    "id": "interior-designer",
    "name": "Interior Designer",
    "profession": "Interior Designer",
    "title": "Interior Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for interior designers and related business professionals.",
    "keywords": [
      "interior designer invoice template",
      "invoice template for interior designer",
      "interior designer billing template",
      "free interior designer invoice",
      "interior designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Interior Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free interior designer invoice template. Professional billing format with customizable fields for interior designer services."
  },
  {
    "id": "interior-stylist",
    "name": "Interior Stylist",
    "profession": "Interior Stylist",
    "title": "Interior Stylist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for interior stylists and related business professionals.",
    "keywords": [
      "interior stylist invoice template",
      "invoice template for interior stylist",
      "interior stylist billing template",
      "free interior stylist invoice",
      "interior stylist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Interior Stylists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free interior stylist invoice template. Professional billing format with customizable fields for interior stylist services."
  },
  {
    "id": "interpreter",
    "name": "Interpreter",
    "profession": "Interpreter",
    "title": "Interpreter Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for interpreters and related business professionals.",
    "keywords": [
      "interpreter invoice template",
      "invoice template for interpreter",
      "interpreter billing template",
      "free interpreter invoice",
      "interpreter invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Interpreters typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free interpreter invoice template. Professional billing format with customizable fields for interpreter services."
  },
  {
    "id": "irrigation-installer",
    "name": "Irrigation Installer",
    "profession": "Irrigation Installer",
    "title": "Irrigation Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for irrigation installers and related business professionals.",
    "keywords": [
      "irrigation installer invoice template",
      "invoice template for irrigation installer",
      "irrigation installer billing template",
      "free irrigation installer invoice",
      "irrigation installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Irrigation Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free irrigation installer invoice template. Professional billing format with customizable fields for irrigation installer services."
  },
  {
    "id": "it-consultant",
    "name": "It Consultant",
    "profession": "It Consultant",
    "title": "It Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for it consultants and related business professionals.",
    "keywords": [
      "it consultant invoice template",
      "invoice template for it consultant",
      "it consultant billing template",
      "free it consultant invoice",
      "it consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "It Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free it consultant invoice template. Professional billing format with customizable fields for it consultant services."
  },
  {
    "id": "it-services",
    "name": "It Services",
    "profession": "It Services",
    "title": "It Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for it servicess and related service professionals.",
    "keywords": [
      "it services invoice template",
      "invoice template for it services",
      "it services billing template",
      "free it services invoice",
      "it services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "It Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free it services invoice template. Professional billing format with customizable fields for it services services."
  },
  {
    "id": "janitorial-service",
    "name": "Janitorial Service",
    "profession": "Janitorial Service",
    "title": "Janitorial Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for janitorial services and related service professionals.",
    "keywords": [
      "janitorial service invoice template",
      "invoice template for janitorial service",
      "janitorial service billing template",
      "free janitorial service invoice",
      "janitorial service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Janitorial Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free janitorial service invoice template. Professional billing format with customizable fields for janitorial service services."
  },
  {
    "id": "junk-removal",
    "name": "Junk Removal",
    "profession": "Junk Removal",
    "title": "Junk Removal Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for junk removals and related business professionals.",
    "keywords": [
      "junk removal invoice template",
      "invoice template for junk removal",
      "junk removal billing template",
      "free junk removal invoice",
      "junk removal invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Junk Removals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free junk removal invoice template. Professional billing format with customizable fields for junk removal services."
  },
  {
    "id": "land-surveyor",
    "name": "Land Surveyor",
    "profession": "Land Surveyor",
    "title": "Land Surveyor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for land surveyors and related business professionals.",
    "keywords": [
      "land surveyor invoice template",
      "invoice template for land surveyor",
      "land surveyor billing template",
      "free land surveyor invoice",
      "land surveyor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Land Surveyors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free land surveyor invoice template. Professional billing format with customizable fields for land surveyor services."
  },
  {
    "id": "landscape-design",
    "name": "Landscape Design",
    "profession": "Landscape Design",
    "title": "Landscape Design Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for landscape designs and related business professionals.",
    "keywords": [
      "landscape design invoice template",
      "invoice template for landscape design",
      "landscape design billing template",
      "free landscape design invoice",
      "landscape design invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Landscape Designs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free landscape design invoice template. Professional billing format with customizable fields for landscape design services."
  },
  {
    "id": "landscaper",
    "name": "Landscaper",
    "profession": "Landscaper",
    "title": "Landscaper Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for landscapers and related business professionals.",
    "keywords": [
      "landscaper invoice template",
      "invoice template for landscaper",
      "landscaper billing template",
      "free landscaper invoice",
      "landscaper invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Landscapers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free landscaper invoice template. Professional billing format with customizable fields for landscaper services."
  },
  {
    "id": "large-format-printing",
    "name": "Large Format Printing",
    "profession": "Large Format Printing",
    "title": "Large Format Printing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for large format printings and related business professionals.",
    "keywords": [
      "large format printing invoice template",
      "invoice template for large format printing",
      "large format printing billing template",
      "free large format printing invoice",
      "large format printing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Large Format Printings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free large format printing invoice template. Professional billing format with customizable fields for large format printing services."
  },
  {
    "id": "lash-technician",
    "name": "Lash Technician",
    "profession": "Lash Technician",
    "title": "Lash Technician Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for lash technicians and related business professionals.",
    "keywords": [
      "lash technician invoice template",
      "invoice template for lash technician",
      "lash technician billing template",
      "free lash technician invoice",
      "lash technician invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Lash Technicians typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free lash technician invoice template. Professional billing format with customizable fields for lash technician services."
  },
  {
    "id": "law-firm",
    "name": "Law Firm",
    "profession": "Law Firm",
    "title": "Law Firm Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for law firms and related business professionals.",
    "keywords": [
      "law firm invoice template",
      "invoice template for law firm",
      "law firm billing template",
      "free law firm invoice",
      "law firm invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Law Firms typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free law firm invoice template. Professional billing format with customizable fields for law firm services."
  },
  {
    "id": "lawn-care",
    "name": "Lawn Care",
    "profession": "Lawn Care",
    "title": "Lawn Care Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for lawn cares and related business professionals.",
    "keywords": [
      "lawn care invoice template",
      "invoice template for lawn care",
      "lawn care billing template",
      "free lawn care invoice",
      "lawn care invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$25-75",
      "project": "$100-5000"
    },
    "industryInfo": "Lawn Cares typically charge between $25-75 per hour depending on experience and project complexity.",
    "seoDescription": "Free lawn care invoice template. Professional billing format with customizable fields for lawn care services."
  },
  {
    "id": "legal-consultant",
    "name": "Legal Consultant",
    "profession": "Legal Consultant",
    "title": "Legal Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for legal consultants and related business professionals.",
    "keywords": [
      "legal consultant invoice template",
      "invoice template for legal consultant",
      "legal consultant billing template",
      "free legal consultant invoice",
      "legal consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Legal Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free legal consultant invoice template. Professional billing format with customizable fields for legal consultant services."
  },
  {
    "id": "legal-services",
    "name": "Legal Services",
    "profession": "Legal Services",
    "title": "Legal Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for legal servicess and related service professionals.",
    "keywords": [
      "legal services invoice template",
      "invoice template for legal services",
      "legal services billing template",
      "free legal services invoice",
      "legal services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Legal Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free legal services invoice template. Professional billing format with customizable fields for legal services services."
  },
  {
    "id": "life-coach",
    "name": "Life Coach",
    "profession": "Life Coach",
    "title": "Life Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for life coachs and related business professionals.",
    "keywords": [
      "life coach invoice template",
      "invoice template for life coach",
      "life coach billing template",
      "free life coach invoice",
      "life coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Life Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free life coach invoice template. Professional billing format with customizable fields for life coach services."
  },
  {
    "id": "lighting-rental",
    "name": "Lighting Rental",
    "profession": "Lighting Rental",
    "title": "Lighting Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for lighting rentals and related business professionals.",
    "keywords": [
      "lighting rental invoice template",
      "invoice template for lighting rental",
      "lighting rental billing template",
      "free lighting rental invoice",
      "lighting rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Lighting Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free lighting rental invoice template. Professional billing format with customizable fields for lighting rental services."
  },
  {
    "id": "limo-service",
    "name": "Limo Service",
    "profession": "Limo Service",
    "title": "Limo Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for limo services and related service professionals.",
    "keywords": [
      "limo service invoice template",
      "invoice template for limo service",
      "limo service billing template",
      "free limo service invoice",
      "limo service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Limo Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free limo service invoice template. Professional billing format with customizable fields for limo service services."
  },
  {
    "id": "locksmith",
    "name": "Locksmith",
    "profession": "Locksmith",
    "title": "Locksmith Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for locksmiths and related business professionals.",
    "keywords": [
      "locksmith invoice template",
      "invoice template for locksmith",
      "locksmith billing template",
      "free locksmith invoice",
      "locksmith invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Locksmiths typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free locksmith invoice template. Professional billing format with customizable fields for locksmith services."
  },
  {
    "id": "logistics",
    "name": "Logistics",
    "profession": "Logistics",
    "title": "Logistics Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for logisticss and related business professionals.",
    "keywords": [
      "logistics invoice template",
      "invoice template for logistics",
      "logistics billing template",
      "free logistics invoice",
      "logistics invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Logisticss typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free logistics invoice template. Professional billing format with customizable fields for logistics services."
  },
  {
    "id": "machinist",
    "name": "Machinist",
    "profession": "Machinist",
    "title": "Machinist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for machinists and related business professionals.",
    "keywords": [
      "machinist invoice template",
      "invoice template for machinist",
      "machinist billing template",
      "free machinist invoice",
      "machinist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Machinists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free machinist invoice template. Professional billing format with customizable fields for machinist services."
  },
  {
    "id": "maintenance",
    "name": "Maintenance",
    "profession": "Maintenance",
    "title": "Maintenance Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for maintenances and related business professionals.",
    "keywords": [
      "maintenance invoice template",
      "invoice template for maintenance",
      "maintenance billing template",
      "free maintenance invoice",
      "maintenance invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Maintenances typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free maintenance invoice template. Professional billing format with customizable fields for maintenance services."
  },
  {
    "id": "maintenance-services",
    "name": "Maintenance Services",
    "profession": "Maintenance Services",
    "title": "Maintenance Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for maintenance servicess and related service professionals.",
    "keywords": [
      "maintenance services invoice template",
      "invoice template for maintenance services",
      "maintenance services billing template",
      "free maintenance services invoice",
      "maintenance services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Maintenance Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free maintenance services invoice template. Professional billing format with customizable fields for maintenance services services."
  },
  {
    "id": "makeup-artist",
    "name": "Makeup Artist",
    "profession": "Makeup Artist",
    "title": "Makeup Artist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for makeup artists and related business professionals.",
    "keywords": [
      "makeup artist invoice template",
      "invoice template for makeup artist",
      "makeup artist billing template",
      "free makeup artist invoice",
      "makeup artist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Makeup Artists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free makeup artist invoice template. Professional billing format with customizable fields for makeup artist services."
  },
  {
    "id": "management-consultant",
    "name": "Management Consultant",
    "profession": "Management Consultant",
    "title": "Management Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for management consultants and related business professionals.",
    "keywords": [
      "management consultant invoice template",
      "invoice template for management consultant",
      "management consultant billing template",
      "free management consultant invoice",
      "management consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$75-300",
      "project": "$2000-100000"
    },
    "industryInfo": "Management Consultants typically charge between $75-300 per hour depending on experience and project complexity.",
    "seoDescription": "Free management consultant invoice template. Professional billing format with customizable fields for management consultant services."
  },
  {
    "id": "manufacturing",
    "name": "Manufacturing",
    "profession": "Manufacturing",
    "title": "Manufacturing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for manufacturings and related business professionals.",
    "keywords": [
      "manufacturing invoice template",
      "invoice template for manufacturing",
      "manufacturing billing template",
      "free manufacturing invoice",
      "manufacturing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Manufacturings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free manufacturing invoice template. Professional billing format with customizable fields for manufacturing services."
  },
  {
    "id": "marketing-agency",
    "name": "Marketing Agency",
    "profession": "Marketing Agency",
    "title": "Marketing Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for marketing agencys and related business professionals.",
    "keywords": [
      "marketing agency invoice template",
      "invoice template for marketing agency",
      "marketing agency billing template",
      "free marketing agency invoice",
      "marketing agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Marketing Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free marketing agency invoice template. Professional billing format with customizable fields for marketing agency services."
  },
  {
    "id": "marketing-automation-consultant",
    "name": "Marketing Automation Consultant",
    "profession": "Marketing Automation Consultant",
    "title": "Marketing Automation Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for marketing automation consultants and related business professionals.",
    "keywords": [
      "marketing automation consultant invoice template",
      "invoice template for marketing automation consultant",
      "marketing automation consultant billing template",
      "free marketing automation consultant invoice",
      "marketing automation consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Marketing Automation Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free marketing automation consultant invoice template. Professional billing format with customizable fields for marketing automation consultant services."
  },
  {
    "id": "marketing-consultant",
    "name": "Marketing Consultant",
    "profession": "Marketing Consultant",
    "title": "Marketing Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for marketing consultants and related business professionals.",
    "keywords": [
      "marketing consultant invoice template",
      "invoice template for marketing consultant",
      "marketing consultant billing template",
      "free marketing consultant invoice",
      "marketing consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Marketing Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free marketing consultant invoice template. Professional billing format with customizable fields for marketing consultant services."
  },
  {
    "id": "marketo-consultant",
    "name": "Marketo Consultant",
    "profession": "Marketo Consultant",
    "title": "Marketo Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for marketo consultants and related business professionals.",
    "keywords": [
      "marketo consultant invoice template",
      "invoice template for marketo consultant",
      "marketo consultant billing template",
      "free marketo consultant invoice",
      "marketo consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Marketo Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free marketo consultant invoice template. Professional billing format with customizable fields for marketo consultant services."
  },
  {
    "id": "martial-arts-instructor",
    "name": "Martial Arts Instructor",
    "profession": "Martial Arts Instructor",
    "title": "Martial Arts Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for martial arts instructors and related business professionals.",
    "keywords": [
      "martial arts instructor invoice template",
      "invoice template for martial arts instructor",
      "martial arts instructor billing template",
      "free martial arts instructor invoice",
      "martial arts instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Martial Arts Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free martial arts instructor invoice template. Professional billing format with customizable fields for martial arts instructor services."
  },
  {
    "id": "masonry",
    "name": "Masonry",
    "profession": "Masonry",
    "title": "Masonry Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for masonrys and related business professionals.",
    "keywords": [
      "masonry invoice template",
      "invoice template for masonry",
      "masonry billing template",
      "free masonry invoice",
      "masonry invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Masonrys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free masonry invoice template. Professional billing format with customizable fields for masonry services."
  },
  {
    "id": "massage-therapist",
    "name": "Massage Therapist",
    "profession": "Massage Therapist",
    "title": "Massage Therapist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for massage therapists and related business professionals.",
    "keywords": [
      "massage therapist invoice template",
      "invoice template for massage therapist",
      "massage therapist billing template",
      "free massage therapist invoice",
      "massage therapist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Massage Therapists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free massage therapist invoice template. Professional billing format with customizable fields for massage therapist services."
  },
  {
    "id": "math-tutor",
    "name": "Math Tutor",
    "profession": "Math Tutor",
    "title": "Math Tutor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for math tutors and related business professionals.",
    "keywords": [
      "math tutor invoice template",
      "invoice template for math tutor",
      "math tutor billing template",
      "free math tutor invoice",
      "math tutor invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Math Tutors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free math tutor invoice template. Professional billing format with customizable fields for math tutor services."
  },
  {
    "id": "meal-prep-service",
    "name": "Meal Prep Service",
    "profession": "Meal Prep Service",
    "title": "Meal Prep Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for meal prep services and related service professionals.",
    "keywords": [
      "meal prep service invoice template",
      "invoice template for meal prep service",
      "meal prep service billing template",
      "free meal prep service invoice",
      "meal prep service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Meal Prep Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free meal prep service invoice template. Professional billing format with customizable fields for meal prep service services."
  },
  {
    "id": "measuring-service",
    "name": "Measuring Service",
    "profession": "Measuring Service",
    "title": "Measuring Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for measuring services and related service professionals.",
    "keywords": [
      "measuring service invoice template",
      "invoice template for measuring service",
      "measuring service billing template",
      "free measuring service invoice",
      "measuring service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Measuring Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free measuring service invoice template. Professional billing format with customizable fields for measuring service services."
  },
  {
    "id": "media-buyer",
    "name": "Media Buyer",
    "profession": "Media Buyer",
    "title": "Media Buyer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for media buyers and related business professionals.",
    "keywords": [
      "media buyer invoice template",
      "invoice template for media buyer",
      "media buyer billing template",
      "free media buyer invoice",
      "media buyer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Media Buyers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free media buyer invoice template. Professional billing format with customizable fields for media buyer services."
  },
  {
    "id": "mediator",
    "name": "Mediator",
    "profession": "Mediator",
    "title": "Mediator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for mediators and related business professionals.",
    "keywords": [
      "mediator invoice template",
      "invoice template for mediator",
      "mediator billing template",
      "free mediator invoice",
      "mediator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Mediators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free mediator invoice template. Professional billing format with customizable fields for mediator services."
  },
  {
    "id": "medical-billing-service",
    "name": "Medical Billing Service",
    "profession": "Medical Billing Service",
    "title": "Medical Billing Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for medical billing services and related service professionals.",
    "keywords": [
      "medical billing service invoice template",
      "invoice template for medical billing service",
      "medical billing service billing template",
      "free medical billing service invoice",
      "medical billing service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Medical Billing Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free medical billing service invoice template. Professional billing format with customizable fields for medical billing service services."
  },
  {
    "id": "mep-engineer",
    "name": "Mep Engineer",
    "profession": "Mep Engineer",
    "title": "Mep Engineer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for mep engineers and related business professionals.",
    "keywords": [
      "mep engineer invoice template",
      "invoice template for mep engineer",
      "mep engineer billing template",
      "free mep engineer invoice",
      "mep engineer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Mep Engineers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free mep engineer invoice template. Professional billing format with customizable fields for mep engineer services."
  },
  {
    "id": "metal-fabricator",
    "name": "Metal Fabricator",
    "profession": "Metal Fabricator",
    "title": "Metal Fabricator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for metal fabricators and related business professionals.",
    "keywords": [
      "metal fabricator invoice template",
      "invoice template for metal fabricator",
      "metal fabricator billing template",
      "free metal fabricator invoice",
      "metal fabricator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Metal Fabricators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free metal fabricator invoice template. Professional billing format with customizable fields for metal fabricator services."
  },
  {
    "id": "midwife",
    "name": "Midwife",
    "profession": "Midwife",
    "title": "Midwife Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for midwifes and related business professionals.",
    "keywords": [
      "midwife invoice template",
      "invoice template for midwife",
      "midwife billing template",
      "free midwife invoice",
      "midwife invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Midwifes typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free midwife invoice template. Professional billing format with customizable fields for midwife services."
  },
  {
    "id": "ml-engineer",
    "name": "Ml Engineer",
    "profession": "Ml Engineer",
    "title": "Ml Engineer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for ml engineers and related business professionals.",
    "keywords": [
      "ml engineer invoice template",
      "invoice template for ml engineer",
      "ml engineer billing template",
      "free ml engineer invoice",
      "ml engineer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Ml Engineers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free ml engineer invoice template. Professional billing format with customizable fields for ml engineer services."
  },
  {
    "id": "mobile-car-wash",
    "name": "Mobile Car Wash",
    "profession": "Mobile Car Wash",
    "title": "Mobile Car Wash Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for mobile car washs and related business professionals.",
    "keywords": [
      "mobile car wash invoice template",
      "invoice template for mobile car wash",
      "mobile car wash billing template",
      "free mobile car wash invoice",
      "mobile car wash invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Mobile Car Washs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free mobile car wash invoice template. Professional billing format with customizable fields for mobile car wash services."
  },
  {
    "id": "mobile-mechanic",
    "name": "Mobile Mechanic",
    "profession": "Mobile Mechanic",
    "title": "Mobile Mechanic Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for mobile mechanics and related business professionals.",
    "keywords": [
      "mobile mechanic invoice template",
      "invoice template for mobile mechanic",
      "mobile mechanic billing template",
      "free mobile mechanic invoice",
      "mobile mechanic invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Mobile Mechanics typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free mobile mechanic invoice template. Professional billing format with customizable fields for mobile mechanic services."
  },
  {
    "id": "mold-remediation",
    "name": "Mold Remediation",
    "profession": "Mold Remediation",
    "title": "Mold Remediation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for mold remediations and related business professionals.",
    "keywords": [
      "mold remediation invoice template",
      "invoice template for mold remediation",
      "mold remediation billing template",
      "free mold remediation invoice",
      "mold remediation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Mold Remediations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free mold remediation invoice template. Professional billing format with customizable fields for mold remediation services."
  },
  {
    "id": "mortgage-broker",
    "name": "Mortgage Broker",
    "profession": "Mortgage Broker",
    "title": "Mortgage Broker Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for mortgage brokers and related business professionals.",
    "keywords": [
      "mortgage broker invoice template",
      "invoice template for mortgage broker",
      "mortgage broker billing template",
      "free mortgage broker invoice",
      "mortgage broker invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Mortgage Brokers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free mortgage broker invoice template. Professional billing format with customizable fields for mortgage broker services."
  },
  {
    "id": "motion-designer",
    "name": "Motion Designer",
    "profession": "Motion Designer",
    "title": "Motion Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for motion designers and related business professionals.",
    "keywords": [
      "motion designer invoice template",
      "invoice template for motion designer",
      "motion designer billing template",
      "free motion designer invoice",
      "motion designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Motion Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free motion designer invoice template. Professional billing format with customizable fields for motion designer services."
  },
  {
    "id": "motorcycle-repair",
    "name": "Motorcycle Repair",
    "profession": "Motorcycle Repair",
    "title": "Motorcycle Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for motorcycle repairs and related business professionals.",
    "keywords": [
      "motorcycle repair invoice template",
      "invoice template for motorcycle repair",
      "motorcycle repair billing template",
      "free motorcycle repair invoice",
      "motorcycle repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Motorcycle Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free motorcycle repair invoice template. Professional billing format with customizable fields for motorcycle repair services."
  },
  {
    "id": "move-out-cleaning",
    "name": "Move Out Cleaning",
    "profession": "Move Out Cleaning",
    "title": "Move Out Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for move out cleanings and related business professionals.",
    "keywords": [
      "move out cleaning invoice template",
      "invoice template for move out cleaning",
      "move out cleaning billing template",
      "free move out cleaning invoice",
      "move out cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Move Out Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free move out cleaning invoice template. Professional billing format with customizable fields for move out cleaning services."
  },
  {
    "id": "moving-company",
    "name": "Moving Company",
    "profession": "Moving Company",
    "title": "Moving Company Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for moving companys and related business professionals.",
    "keywords": [
      "moving company invoice template",
      "invoice template for moving company",
      "moving company billing template",
      "free moving company invoice",
      "moving company invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Moving Companys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free moving company invoice template. Professional billing format with customizable fields for moving company services."
  },
  {
    "id": "music-instructor",
    "name": "Music Instructor",
    "profession": "Music Instructor",
    "title": "Music Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for music instructors and related business professionals.",
    "keywords": [
      "music instructor invoice template",
      "invoice template for music instructor",
      "music instructor billing template",
      "free music instructor invoice",
      "music instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Music Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free music instructor invoice template. Professional billing format with customizable fields for music instructor services."
  },
  {
    "id": "music-producer",
    "name": "Music Producer",
    "profession": "Music Producer",
    "title": "Music Producer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for music producers and related business professionals.",
    "keywords": [
      "music producer invoice template",
      "invoice template for music producer",
      "music producer billing template",
      "free music producer invoice",
      "music producer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Music Producers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free music producer invoice template. Professional billing format with customizable fields for music producer services."
  },
  {
    "id": "music-teacher",
    "name": "Music Teacher",
    "profession": "Music Teacher",
    "title": "Music Teacher Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for music teachers and related business professionals.",
    "keywords": [
      "music teacher invoice template",
      "invoice template for music teacher",
      "music teacher billing template",
      "free music teacher invoice",
      "music teacher invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Music Teachers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free music teacher invoice template. Professional billing format with customizable fields for music teacher services."
  },
  {
    "id": "nail-technician",
    "name": "Nail Technician",
    "profession": "Nail Technician",
    "title": "Nail Technician Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for nail technicians and related business professionals.",
    "keywords": [
      "nail technician invoice template",
      "invoice template for nail technician",
      "nail technician billing template",
      "free nail technician invoice",
      "nail technician invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Nail Technicians typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free nail technician invoice template. Professional billing format with customizable fields for nail technician services."
  },
  {
    "id": "nanny",
    "name": "Nanny",
    "profession": "Nanny",
    "title": "Nanny Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for nannys and related business professionals.",
    "keywords": [
      "nanny invoice template",
      "invoice template for nanny",
      "nanny billing template",
      "free nanny invoice",
      "nanny invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Nannys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free nanny invoice template. Professional billing format with customizable fields for nanny services."
  },
  {
    "id": "naturopath",
    "name": "Naturopath",
    "profession": "Naturopath",
    "title": "Naturopath Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for naturopaths and related business professionals.",
    "keywords": [
      "naturopath invoice template",
      "invoice template for naturopath",
      "naturopath billing template",
      "free naturopath invoice",
      "naturopath invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Naturopaths typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free naturopath invoice template. Professional billing format with customizable fields for naturopath services."
  },
  {
    "id": "network-engineer",
    "name": "Network Engineer",
    "profession": "Network Engineer",
    "title": "Network Engineer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for network engineers and related business professionals.",
    "keywords": [
      "network engineer invoice template",
      "invoice template for network engineer",
      "network engineer billing template",
      "free network engineer invoice",
      "network engineer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Network Engineers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free network engineer invoice template. Professional billing format with customizable fields for network engineer services."
  },
  {
    "id": "newborn-photographer",
    "name": "Newborn Photographer",
    "profession": "Newborn Photographer",
    "title": "Newborn Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for newborn photographers and related business professionals.",
    "keywords": [
      "newborn photographer invoice template",
      "invoice template for newborn photographer",
      "newborn photographer billing template",
      "free newborn photographer invoice",
      "newborn photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Newborn Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free newborn photographer invoice template. Professional billing format with customizable fields for newborn photographer services."
  },
  {
    "id": "notary",
    "name": "Notary",
    "profession": "Notary",
    "title": "Notary Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for notarys and related business professionals.",
    "keywords": [
      "notary invoice template",
      "invoice template for notary",
      "notary billing template",
      "free notary invoice",
      "notary invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Notarys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free notary invoice template. Professional billing format with customizable fields for notary services."
  },
  {
    "id": "nutritionist",
    "name": "Nutritionist",
    "profession": "Nutritionist",
    "title": "Nutritionist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for nutritionists and related business professionals.",
    "keywords": [
      "nutritionist invoice template",
      "invoice template for nutritionist",
      "nutritionist billing template",
      "free nutritionist invoice",
      "nutritionist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Nutritionists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free nutritionist invoice template. Professional billing format with customizable fields for nutritionist services."
  },
  {
    "id": "occupational-therapist",
    "name": "Occupational Therapist",
    "profession": "Occupational Therapist",
    "title": "Occupational Therapist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for occupational therapists and related business professionals.",
    "keywords": [
      "occupational therapist invoice template",
      "invoice template for occupational therapist",
      "occupational therapist billing template",
      "free occupational therapist invoice",
      "occupational therapist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Occupational Therapists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free occupational therapist invoice template. Professional billing format with customizable fields for occupational therapist services."
  },
  {
    "id": "office-cleaning",
    "name": "Office Cleaning",
    "profession": "Office Cleaning",
    "title": "Office Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for office cleanings and related business professionals.",
    "keywords": [
      "office cleaning invoice template",
      "invoice template for office cleaning",
      "office cleaning billing template",
      "free office cleaning invoice",
      "office cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Office Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free office cleaning invoice template. Professional billing format with customizable fields for office cleaning services."
  },
  {
    "id": "office-maintenance",
    "name": "Office Maintenance",
    "profession": "Office Maintenance",
    "title": "Office Maintenance Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for office maintenances and related business professionals.",
    "keywords": [
      "office maintenance invoice template",
      "invoice template for office maintenance",
      "office maintenance billing template",
      "free office maintenance invoice",
      "office maintenance invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Office Maintenances typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free office maintenance invoice template. Professional billing format with customizable fields for office maintenance services."
  },
  {
    "id": "painter",
    "name": "Painter",
    "profession": "Painter",
    "title": "Painter Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for painters and related business professionals.",
    "keywords": [
      "painter invoice template",
      "invoice template for painter",
      "painter billing template",
      "free painter invoice",
      "painter invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$25-75",
      "project": "$100-5000"
    },
    "industryInfo": "Painters typically charge between $25-75 per hour depending on experience and project complexity.",
    "seoDescription": "Free painter invoice template. Professional billing format with customizable fields for painter services."
  },
  {
    "id": "paralegal",
    "name": "Paralegal",
    "profession": "Paralegal",
    "title": "Paralegal Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for paralegals and related business professionals.",
    "keywords": [
      "paralegal invoice template",
      "invoice template for paralegal",
      "paralegal billing template",
      "free paralegal invoice",
      "paralegal invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Paralegals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free paralegal invoice template. Professional billing format with customizable fields for paralegal services."
  },
  {
    "id": "parking-lot-striping",
    "name": "Parking Lot Striping",
    "profession": "Parking Lot Striping",
    "title": "Parking Lot Striping Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for parking lot stripings and related business professionals.",
    "keywords": [
      "parking lot striping invoice template",
      "invoice template for parking lot striping",
      "parking lot striping billing template",
      "free parking lot striping invoice",
      "parking lot striping invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Parking Lot Stripings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free parking lot striping invoice template. Professional billing format with customizable fields for parking lot striping services."
  },
  {
    "id": "pastry-chef",
    "name": "Pastry Chef",
    "profession": "Pastry Chef",
    "title": "Pastry Chef Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pastry chefs and related business professionals.",
    "keywords": [
      "pastry chef invoice template",
      "invoice template for pastry chef",
      "pastry chef billing template",
      "free pastry chef invoice",
      "pastry chef invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pastry Chefs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pastry chef invoice template. Professional billing format with customizable fields for pastry chef services."
  },
  {
    "id": "payroll-service",
    "name": "Payroll Service",
    "profession": "Payroll Service",
    "title": "Payroll Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for payroll services and related service professionals.",
    "keywords": [
      "payroll service invoice template",
      "invoice template for payroll service",
      "payroll service billing template",
      "free payroll service invoice",
      "payroll service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Payroll Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free payroll service invoice template. Professional billing format with customizable fields for payroll service services."
  },
  {
    "id": "penetration-tester",
    "name": "Penetration Tester",
    "profession": "Penetration Tester",
    "title": "Penetration Tester Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for penetration testers and related business professionals.",
    "keywords": [
      "penetration tester invoice template",
      "invoice template for penetration tester",
      "penetration tester billing template",
      "free penetration tester invoice",
      "penetration tester invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Penetration Testers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free penetration tester invoice template. Professional billing format with customizable fields for penetration tester services."
  },
  {
    "id": "personal-chef",
    "name": "Personal Chef",
    "profession": "Personal Chef",
    "title": "Personal Chef Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for personal chefs and related business professionals.",
    "keywords": [
      "personal chef invoice template",
      "invoice template for personal chef",
      "personal chef billing template",
      "free personal chef invoice",
      "personal chef invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Personal Chefs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free personal chef invoice template. Professional billing format with customizable fields for personal chef services."
  },
  {
    "id": "personal-trainer",
    "name": "Personal Trainer",
    "profession": "Personal Trainer",
    "title": "Personal Trainer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for personal trainers and related business professionals.",
    "keywords": [
      "personal trainer invoice template",
      "invoice template for personal trainer",
      "personal trainer billing template",
      "free personal trainer invoice",
      "personal trainer invoice format"
    ],
    "commonServices": [
      "Personal training",
      "Group classes",
      "Nutrition coaching",
      "Program design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Personal Trainers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free personal trainer invoice template. Professional billing format with customizable fields for personal trainer services."
  },
  {
    "id": "pest-control",
    "name": "Pest Control",
    "profession": "Pest Control",
    "title": "Pest Control Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pest controls and related business professionals.",
    "keywords": [
      "pest control invoice template",
      "invoice template for pest control",
      "pest control billing template",
      "free pest control invoice",
      "pest control invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pest Controls typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pest control invoice template. Professional billing format with customizable fields for pest control services."
  },
  {
    "id": "pet-boarding",
    "name": "Pet Boarding",
    "profession": "Pet Boarding",
    "title": "Pet Boarding Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pet boardings and related business professionals.",
    "keywords": [
      "pet boarding invoice template",
      "invoice template for pet boarding",
      "pet boarding billing template",
      "free pet boarding invoice",
      "pet boarding invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pet Boardings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pet boarding invoice template. Professional billing format with customizable fields for pet boarding services."
  },
  {
    "id": "pet-daycare",
    "name": "Pet Daycare",
    "profession": "Pet Daycare",
    "title": "Pet Daycare Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pet daycares and related business professionals.",
    "keywords": [
      "pet daycare invoice template",
      "invoice template for pet daycare",
      "pet daycare billing template",
      "free pet daycare invoice",
      "pet daycare invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pet Daycares typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pet daycare invoice template. Professional billing format with customizable fields for pet daycare services."
  },
  {
    "id": "pet-groomer",
    "name": "Pet Groomer",
    "profession": "Pet Groomer",
    "title": "Pet Groomer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pet groomers and related business professionals.",
    "keywords": [
      "pet groomer invoice template",
      "invoice template for pet groomer",
      "pet groomer billing template",
      "free pet groomer invoice",
      "pet groomer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pet Groomers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pet groomer invoice template. Professional billing format with customizable fields for pet groomer services."
  },
  {
    "id": "pet-sitter",
    "name": "Pet Sitter",
    "profession": "Pet Sitter",
    "title": "Pet Sitter Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pet sitters and related business professionals.",
    "keywords": [
      "pet sitter invoice template",
      "invoice template for pet sitter",
      "pet sitter billing template",
      "free pet sitter invoice",
      "pet sitter invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pet Sitters typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pet sitter invoice template. Professional billing format with customizable fields for pet sitter services."
  },
  {
    "id": "photo-booth-rental",
    "name": "Photo Booth Rental",
    "profession": "Photo Booth Rental",
    "title": "Photo Booth Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for photo booth rentals and related business professionals.",
    "keywords": [
      "photo booth rental invoice template",
      "invoice template for photo booth rental",
      "photo booth rental billing template",
      "free photo booth rental invoice",
      "photo booth rental invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Photo Booth Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free photo booth rental invoice template. Professional billing format with customizable fields for photo booth rental services."
  },
  {
    "id": "photographer",
    "name": "Photographer",
    "profession": "Photographer",
    "title": "Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for photographers and related business professionals.",
    "keywords": [
      "photographer invoice template",
      "invoice template for photographer",
      "photographer billing template",
      "free photographer invoice",
      "photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$35-100",
      "project": "$500-10000"
    },
    "industryInfo": "Photographers typically charge between $35-100 per hour depending on experience and project complexity.",
    "seoDescription": "Free photographer invoice template. Professional billing format with customizable fields for photographer services."
  },
  {
    "id": "physical-therapist",
    "name": "Physical Therapist",
    "profession": "Physical Therapist",
    "title": "Physical Therapist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for physical therapists and related business professionals.",
    "keywords": [
      "physical therapist invoice template",
      "invoice template for physical therapist",
      "physical therapist billing template",
      "free physical therapist invoice",
      "physical therapist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Physical Therapists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free physical therapist invoice template. Professional billing format with customizable fields for physical therapist services."
  },
  {
    "id": "piano-teacher",
    "name": "Piano Teacher",
    "profession": "Piano Teacher",
    "title": "Piano Teacher Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for piano teachers and related business professionals.",
    "keywords": [
      "piano teacher invoice template",
      "invoice template for piano teacher",
      "piano teacher billing template",
      "free piano teacher invoice",
      "piano teacher invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Piano Teachers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free piano teacher invoice template. Professional billing format with customizable fields for piano teacher services."
  },
  {
    "id": "pilates-instructor",
    "name": "Pilates Instructor",
    "profession": "Pilates Instructor",
    "title": "Pilates Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pilates instructors and related business professionals.",
    "keywords": [
      "pilates instructor invoice template",
      "invoice template for pilates instructor",
      "pilates instructor billing template",
      "free pilates instructor invoice",
      "pilates instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pilates Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pilates instructor invoice template. Professional billing format with customizable fields for pilates instructor services."
  },
  {
    "id": "plumber",
    "name": "Plumber",
    "profession": "Plumber",
    "title": "Plumber Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for plumbers and related business professionals.",
    "keywords": [
      "plumber invoice template",
      "invoice template for plumber",
      "plumber billing template",
      "free plumber invoice",
      "plumber invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Plumbers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free plumber invoice template. Professional billing format with customizable fields for plumber services."
  },
  {
    "id": "plumbing-and-heating",
    "name": "Plumbing And Heating",
    "profession": "Plumbing And Heating",
    "title": "Plumbing And Heating Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for plumbing and heatings and related business professionals.",
    "keywords": [
      "plumbing and heating invoice template",
      "invoice template for plumbing and heating",
      "plumbing and heating billing template",
      "free plumbing and heating invoice",
      "plumbing and heating invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Plumbing And Heatings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free plumbing and heating invoice template. Professional billing format with customizable fields for plumbing and heating services."
  },
  {
    "id": "podcast-producer",
    "name": "Podcast Producer",
    "profession": "Podcast Producer",
    "title": "Podcast Producer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for podcast producers and related business professionals.",
    "keywords": [
      "podcast producer invoice template",
      "invoice template for podcast producer",
      "podcast producer billing template",
      "free podcast producer invoice",
      "podcast producer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Podcast Producers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free podcast producer invoice template. Professional billing format with customizable fields for podcast producer services."
  },
  {
    "id": "pool-cleaning",
    "name": "Pool Cleaning",
    "profession": "Pool Cleaning",
    "title": "Pool Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pool cleanings and related business professionals.",
    "keywords": [
      "pool cleaning invoice template",
      "invoice template for pool cleaning",
      "pool cleaning billing template",
      "free pool cleaning invoice",
      "pool cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pool Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pool cleaning invoice template. Professional billing format with customizable fields for pool cleaning services."
  },
  {
    "id": "portrait-photographer",
    "name": "Portrait Photographer",
    "profession": "Portrait Photographer",
    "title": "Portrait Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for portrait photographers and related business professionals.",
    "keywords": [
      "portrait photographer invoice template",
      "invoice template for portrait photographer",
      "portrait photographer billing template",
      "free portrait photographer invoice",
      "portrait photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Portrait Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free portrait photographer invoice template. Professional billing format with customizable fields for portrait photographer services."
  },
  {
    "id": "post-construction-cleaning",
    "name": "Post Construction Cleaning",
    "profession": "Post Construction Cleaning",
    "title": "Post Construction Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for post construction cleanings and related business professionals.",
    "keywords": [
      "post construction cleaning invoice template",
      "invoice template for post construction cleaning",
      "post construction cleaning billing template",
      "free post construction cleaning invoice",
      "post construction cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Post Construction Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free post construction cleaning invoice template. Professional billing format with customizable fields for post construction cleaning services."
  },
  {
    "id": "pressure-washing",
    "name": "Pressure Washing",
    "profession": "Pressure Washing",
    "title": "Pressure Washing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for pressure washings and related business professionals.",
    "keywords": [
      "pressure washing invoice template",
      "invoice template for pressure washing",
      "pressure washing billing template",
      "free pressure washing invoice",
      "pressure washing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Pressure Washings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free pressure washing invoice template. Professional billing format with customizable fields for pressure washing services."
  },
  {
    "id": "print-on-demand",
    "name": "Print On Demand",
    "profession": "Print On Demand",
    "title": "Print On Demand Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for print on demands and related business professionals.",
    "keywords": [
      "print on demand invoice template",
      "invoice template for print on demand",
      "print on demand billing template",
      "free print on demand invoice",
      "print on demand invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Print On Demands typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free print on demand invoice template. Professional billing format with customizable fields for print on demand services."
  },
  {
    "id": "printing-services",
    "name": "Printing Services",
    "profession": "Printing Services",
    "title": "Printing Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for printing servicess and related service professionals.",
    "keywords": [
      "printing services invoice template",
      "invoice template for printing services",
      "printing services billing template",
      "free printing services invoice",
      "printing services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Printing Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free printing services invoice template. Professional billing format with customizable fields for printing services services."
  },
  {
    "id": "private-chef",
    "name": "Private Chef",
    "profession": "Private Chef",
    "title": "Private Chef Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for private chefs and related business professionals.",
    "keywords": [
      "private chef invoice template",
      "invoice template for private chef",
      "private chef billing template",
      "free private chef invoice",
      "private chef invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Private Chefs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free private chef invoice template. Professional billing format with customizable fields for private chef services."
  },
  {
    "id": "private-investigator",
    "name": "Private Investigator",
    "profession": "Private Investigator",
    "title": "Private Investigator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for private investigators and related business professionals.",
    "keywords": [
      "private investigator invoice template",
      "invoice template for private investigator",
      "private investigator billing template",
      "free private investigator invoice",
      "private investigator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Private Investigators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free private investigator invoice template. Professional billing format with customizable fields for private investigator services."
  },
  {
    "id": "process-server",
    "name": "Process Server",
    "profession": "Process Server",
    "title": "Process Server Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for process servers and related business professionals.",
    "keywords": [
      "process server invoice template",
      "invoice template for process server",
      "process server billing template",
      "free process server invoice",
      "process server invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Process Servers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free process server invoice template. Professional billing format with customizable fields for process server services."
  },
  {
    "id": "product-analyst",
    "name": "Product Analyst",
    "profession": "Product Analyst",
    "title": "Product Analyst Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for product analysts and related business professionals.",
    "keywords": [
      "product analyst invoice template",
      "invoice template for product analyst",
      "product analyst billing template",
      "free product analyst invoice",
      "product analyst invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Product Analysts typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free product analyst invoice template. Professional billing format with customizable fields for product analyst services."
  },
  {
    "id": "product-designer",
    "name": "Product Designer",
    "profession": "Product Designer",
    "title": "Product Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for product designers and related business professionals.",
    "keywords": [
      "product designer invoice template",
      "invoice template for product designer",
      "product designer billing template",
      "free product designer invoice",
      "product designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Product Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free product designer invoice template. Professional billing format with customizable fields for product designer services."
  },
  {
    "id": "product-photographer",
    "name": "Product Photographer",
    "profession": "Product Photographer",
    "title": "Product Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for product photographers and related business professionals.",
    "keywords": [
      "product photographer invoice template",
      "invoice template for product photographer",
      "product photographer billing template",
      "free product photographer invoice",
      "product photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Product Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free product photographer invoice template. Professional billing format with customizable fields for product photographer services."
  },
  {
    "id": "product-sales",
    "name": "Product Sales",
    "profession": "Product Sales",
    "title": "Product Sales Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for product saless and related business professionals.",
    "keywords": [
      "product sales invoice template",
      "invoice template for product sales",
      "product sales billing template",
      "free product sales invoice",
      "product sales invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Product Saless typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free product sales invoice template. Professional billing format with customizable fields for product sales services."
  },
  {
    "id": "professional-services",
    "name": "Professional Services",
    "profession": "Professional Services",
    "title": "Professional Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for professional servicess and related service professionals.",
    "keywords": [
      "professional services invoice template",
      "invoice template for professional services",
      "professional services billing template",
      "free professional services invoice",
      "professional services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Professional Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free professional services invoice template. Professional billing format with customizable fields for professional services services."
  },
  {
    "id": "project-manager",
    "name": "Project Manager",
    "profession": "Project Manager",
    "title": "Project Manager Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for project managers and related business professionals.",
    "keywords": [
      "project manager invoice template",
      "invoice template for project manager",
      "project manager billing template",
      "free project manager invoice",
      "project manager invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Project Managers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free project manager invoice template. Professional billing format with customizable fields for project manager services."
  },
  {
    "id": "proofreading",
    "name": "Proofreading",
    "profession": "Proofreading",
    "title": "Proofreading Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for proofreadings and related business professionals.",
    "keywords": [
      "proofreading invoice template",
      "invoice template for proofreading",
      "proofreading billing template",
      "free proofreading invoice",
      "proofreading invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Proofreadings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free proofreading invoice template. Professional billing format with customizable fields for proofreading services."
  },
  {
    "id": "prop-stylist",
    "name": "Prop Stylist",
    "profession": "Prop Stylist",
    "title": "Prop Stylist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for prop stylists and related business professionals.",
    "keywords": [
      "prop stylist invoice template",
      "invoice template for prop stylist",
      "prop stylist billing template",
      "free prop stylist invoice",
      "prop stylist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Prop Stylists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free prop stylist invoice template. Professional billing format with customizable fields for prop stylist services."
  },
  {
    "id": "propane-service",
    "name": "Propane Service",
    "profession": "Propane Service",
    "title": "Propane Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for propane services and related service professionals.",
    "keywords": [
      "propane service invoice template",
      "invoice template for propane service",
      "propane service billing template",
      "free propane service invoice",
      "propane service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Propane Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free propane service invoice template. Professional billing format with customizable fields for propane service services."
  },
  {
    "id": "property-maintenance",
    "name": "Property Maintenance",
    "profession": "Property Maintenance",
    "title": "Property Maintenance Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for property maintenances and related business professionals.",
    "keywords": [
      "property maintenance invoice template",
      "invoice template for property maintenance",
      "property maintenance billing template",
      "free property maintenance invoice",
      "property maintenance invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Property Maintenances typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free property maintenance invoice template. Professional billing format with customizable fields for property maintenance services."
  },
  {
    "id": "property-management",
    "name": "Property Management",
    "profession": "Property Management",
    "title": "Property Management Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for property managements and related business professionals.",
    "keywords": [
      "property management invoice template",
      "invoice template for property management",
      "property management billing template",
      "free property management invoice",
      "property management invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Property Managements typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free property management invoice template. Professional billing format with customizable fields for property management services."
  },
  {
    "id": "property-manager",
    "name": "Property Manager",
    "profession": "Property Manager",
    "title": "Property Manager Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for property managers and related business professionals.",
    "keywords": [
      "property manager invoice template",
      "invoice template for property manager",
      "property manager billing template",
      "free property manager invoice",
      "property manager invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Property Managers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free property manager invoice template. Professional billing format with customizable fields for property manager services."
  },
  {
    "id": "property-photographer",
    "name": "Property Photographer",
    "profession": "Property Photographer",
    "title": "Property Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for property photographers and related business professionals.",
    "keywords": [
      "property photographer invoice template",
      "invoice template for property photographer",
      "property photographer billing template",
      "free property photographer invoice",
      "property photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Property Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free property photographer invoice template. Professional billing format with customizable fields for property photographer services."
  },
  {
    "id": "property-stager",
    "name": "Property Stager",
    "profession": "Property Stager",
    "title": "Property Stager Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for property stagers and related business professionals.",
    "keywords": [
      "property stager invoice template",
      "invoice template for property stager",
      "property stager billing template",
      "free property stager invoice",
      "property stager invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Property Stagers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free property stager invoice template. Professional billing format with customizable fields for property stager services."
  },
  {
    "id": "proposal-writer",
    "name": "Proposal Writer",
    "profession": "Proposal Writer",
    "title": "Proposal Writer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for proposal writers and related business professionals.",
    "keywords": [
      "proposal writer invoice template",
      "invoice template for proposal writer",
      "proposal writer billing template",
      "free proposal writer invoice",
      "proposal writer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Proposal Writers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free proposal writer invoice template. Professional billing format with customizable fields for proposal writer services."
  },
  {
    "id": "real-estate-agent",
    "name": "Real Estate Agent",
    "profession": "Real Estate Agent",
    "title": "Real Estate Agent Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for real estate agents and related business professionals.",
    "keywords": [
      "real estate agent invoice template",
      "invoice template for real estate agent",
      "real estate agent billing template",
      "free real estate agent invoice",
      "real estate agent invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Real Estate Agents typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free real estate agent invoice template. Professional billing format with customizable fields for real estate agent services."
  },
  {
    "id": "real-estate-appraiser",
    "name": "Real Estate Appraiser",
    "profession": "Real Estate Appraiser",
    "title": "Real Estate Appraiser Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for real estate appraisers and related business professionals.",
    "keywords": [
      "real estate appraiser invoice template",
      "invoice template for real estate appraiser",
      "real estate appraiser billing template",
      "free real estate appraiser invoice",
      "real estate appraiser invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Real Estate Appraisers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free real estate appraiser invoice template. Professional billing format with customizable fields for real estate appraiser services."
  },
  {
    "id": "real-estate-consultant",
    "name": "Real Estate Consultant",
    "profession": "Real Estate Consultant",
    "title": "Real Estate Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for real estate consultants and related business professionals.",
    "keywords": [
      "real estate consultant invoice template",
      "invoice template for real estate consultant",
      "real estate consultant billing template",
      "free real estate consultant invoice",
      "real estate consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Real Estate Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free real estate consultant invoice template. Professional billing format with customizable fields for real estate consultant services."
  },
  {
    "id": "real-estate-photographer",
    "name": "Real Estate Photographer",
    "profession": "Real Estate Photographer",
    "title": "Real Estate Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for real estate photographers and related business professionals.",
    "keywords": [
      "real estate photographer invoice template",
      "invoice template for real estate photographer",
      "real estate photographer billing template",
      "free real estate photographer invoice",
      "real estate photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Real Estate Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free real estate photographer invoice template. Professional billing format with customizable fields for real estate photographer services."
  },
  {
    "id": "recruiting-agency",
    "name": "Recruiting Agency",
    "profession": "Recruiting Agency",
    "title": "Recruiting Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for recruiting agencys and related business professionals.",
    "keywords": [
      "recruiting agency invoice template",
      "invoice template for recruiting agency",
      "recruiting agency billing template",
      "free recruiting agency invoice",
      "recruiting agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Recruiting Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free recruiting agency invoice template. Professional billing format with customizable fields for recruiting agency services."
  },
  {
    "id": "renovation",
    "name": "Renovation",
    "profession": "Renovation",
    "title": "Renovation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for renovations and related business professionals.",
    "keywords": [
      "renovation invoice template",
      "invoice template for renovation",
      "renovation billing template",
      "free renovation invoice",
      "renovation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Renovations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free renovation invoice template. Professional billing format with customizable fields for renovation services."
  },
  {
    "id": "research-consultant",
    "name": "Research Consultant",
    "profession": "Research Consultant",
    "title": "Research Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for research consultants and related business professionals.",
    "keywords": [
      "research consultant invoice template",
      "invoice template for research consultant",
      "research consultant billing template",
      "free research consultant invoice",
      "research consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Research Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free research consultant invoice template. Professional billing format with customizable fields for research consultant services."
  },
  {
    "id": "resume-writer",
    "name": "Resume Writer",
    "profession": "Resume Writer",
    "title": "Resume Writer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for resume writers and related business professionals.",
    "keywords": [
      "resume writer invoice template",
      "invoice template for resume writer",
      "resume writer billing template",
      "free resume writer invoice",
      "resume writer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Resume Writers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free resume writer invoice template. Professional billing format with customizable fields for resume writer services."
  },
  {
    "id": "retail",
    "name": "Retail",
    "profession": "Retail",
    "title": "Retail Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for retails and related business professionals.",
    "keywords": [
      "retail invoice template",
      "invoice template for retail",
      "retail billing template",
      "free retail invoice",
      "retail invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Retails typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free retail invoice template. Professional billing format with customizable fields for retail services."
  },
  {
    "id": "retaining-wall-contractor",
    "name": "Retaining Wall Contractor",
    "profession": "Retaining Wall Contractor",
    "title": "Retaining Wall Contractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for retaining wall contractors and related business professionals.",
    "keywords": [
      "retaining wall contractor invoice template",
      "invoice template for retaining wall contractor",
      "retaining wall contractor billing template",
      "free retaining wall contractor invoice",
      "retaining wall contractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Retaining Wall Contractors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free retaining wall contractor invoice template. Professional billing format with customizable fields for retaining wall contractor services."
  },
  {
    "id": "rideshare-driver",
    "name": "Rideshare Driver",
    "profession": "Rideshare Driver",
    "title": "Rideshare Driver Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for rideshare drivers and related business professionals.",
    "keywords": [
      "rideshare driver invoice template",
      "invoice template for rideshare driver",
      "rideshare driver billing template",
      "free rideshare driver invoice",
      "rideshare driver invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Rideshare Drivers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free rideshare driver invoice template. Professional billing format with customizable fields for rideshare driver services."
  },
  {
    "id": "roofing",
    "name": "Roofing",
    "profession": "Roofing",
    "title": "Roofing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for roofings and related business professionals.",
    "keywords": [
      "roofing invoice template",
      "invoice template for roofing",
      "roofing billing template",
      "free roofing invoice",
      "roofing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Roofings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free roofing invoice template. Professional billing format with customizable fields for roofing services."
  },
  {
    "id": "rv-repair",
    "name": "Rv Repair",
    "profession": "Rv Repair",
    "title": "Rv Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for rv repairs and related business professionals.",
    "keywords": [
      "rv repair invoice template",
      "invoice template for rv repair",
      "rv repair billing template",
      "free rv repair invoice",
      "rv repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Rv Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free rv repair invoice template. Professional billing format with customizable fields for rv repair services."
  },
  {
    "id": "sales",
    "name": "Sales",
    "profession": "Sales",
    "title": "Sales Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for saless and related business professionals.",
    "keywords": [
      "sales invoice template",
      "invoice template for sales",
      "sales billing template",
      "free sales invoice",
      "sales invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Saless typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sales invoice template. Professional billing format with customizable fields for sales services."
  },
  {
    "id": "salesforce-consultant",
    "name": "Salesforce Consultant",
    "profession": "Salesforce Consultant",
    "title": "Salesforce Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for salesforce consultants and related business professionals.",
    "keywords": [
      "salesforce consultant invoice template",
      "invoice template for salesforce consultant",
      "salesforce consultant billing template",
      "free salesforce consultant invoice",
      "salesforce consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Salesforce Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free salesforce consultant invoice template. Professional billing format with customizable fields for salesforce consultant services."
  },
  {
    "id": "sat-tutor",
    "name": "Sat Tutor",
    "profession": "Sat Tutor",
    "title": "Sat Tutor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for sat tutors and related business professionals.",
    "keywords": [
      "sat tutor invoice template",
      "invoice template for sat tutor",
      "sat tutor billing template",
      "free sat tutor invoice",
      "sat tutor invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Sat Tutors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sat tutor invoice template. Professional billing format with customizable fields for sat tutor services."
  },
  {
    "id": "satellite-installer",
    "name": "Satellite Installer",
    "profession": "Satellite Installer",
    "title": "Satellite Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for satellite installers and related business professionals.",
    "keywords": [
      "satellite installer invoice template",
      "invoice template for satellite installer",
      "satellite installer billing template",
      "free satellite installer invoice",
      "satellite installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Satellite Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free satellite installer invoice template. Professional billing format with customizable fields for satellite installer services."
  },
  {
    "id": "screen-printing",
    "name": "Screen Printing",
    "profession": "Screen Printing",
    "title": "Screen Printing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for screen printings and related business professionals.",
    "keywords": [
      "screen printing invoice template",
      "invoice template for screen printing",
      "screen printing billing template",
      "free screen printing invoice",
      "screen printing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Screen Printings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free screen printing invoice template. Professional billing format with customizable fields for screen printing services."
  },
  {
    "id": "security-consultant",
    "name": "Security Consultant",
    "profession": "Security Consultant",
    "title": "Security Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for security consultants and related business professionals.",
    "keywords": [
      "security consultant invoice template",
      "invoice template for security consultant",
      "security consultant billing template",
      "free security consultant invoice",
      "security consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Security Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free security consultant invoice template. Professional billing format with customizable fields for security consultant services."
  },
  {
    "id": "security-guard",
    "name": "Security Guard",
    "profession": "Security Guard",
    "title": "Security Guard Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for security guards and related business professionals.",
    "keywords": [
      "security guard invoice template",
      "invoice template for security guard",
      "security guard billing template",
      "free security guard invoice",
      "security guard invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Security Guards typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free security guard invoice template. Professional billing format with customizable fields for security guard services."
  },
  {
    "id": "security-service",
    "name": "Security Service",
    "profession": "Security Service",
    "title": "Security Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for security services and related service professionals.",
    "keywords": [
      "security service invoice template",
      "invoice template for security service",
      "security service billing template",
      "free security service invoice",
      "security service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Security Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free security service invoice template. Professional billing format with customizable fields for security service services."
  },
  {
    "id": "seo-agency",
    "name": "Seo Agency",
    "profession": "Seo Agency",
    "title": "Seo Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for seo agencys and related business professionals.",
    "keywords": [
      "seo agency invoice template",
      "invoice template for seo agency",
      "seo agency billing template",
      "free seo agency invoice",
      "seo agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Seo Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free seo agency invoice template. Professional billing format with customizable fields for seo agency services."
  },
  {
    "id": "seo-consultant",
    "name": "Seo Consultant",
    "profession": "Seo Consultant",
    "title": "Seo Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for seo consultants and related business professionals.",
    "keywords": [
      "seo consultant invoice template",
      "invoice template for seo consultant",
      "seo consultant billing template",
      "free seo consultant invoice",
      "seo consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Seo Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free seo consultant invoice template. Professional billing format with customizable fields for seo consultant services."
  },
  {
    "id": "septic-service",
    "name": "Septic Service",
    "profession": "Septic Service",
    "title": "Septic Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for septic services and related service professionals.",
    "keywords": [
      "septic service invoice template",
      "invoice template for septic service",
      "septic service billing template",
      "free septic service invoice",
      "septic service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Septic Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free septic service invoice template. Professional billing format with customizable fields for septic service services."
  },
  {
    "id": "session-musician",
    "name": "Session Musician",
    "profession": "Session Musician",
    "title": "Session Musician Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for session musicians and related business professionals.",
    "keywords": [
      "session musician invoice template",
      "invoice template for session musician",
      "session musician billing template",
      "free session musician invoice",
      "session musician invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Session Musicians typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free session musician invoice template. Professional billing format with customizable fields for session musician services."
  },
  {
    "id": "set-designer",
    "name": "Set Designer",
    "profession": "Set Designer",
    "title": "Set Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for set designers and related business professionals.",
    "keywords": [
      "set designer invoice template",
      "invoice template for set designer",
      "set designer billing template",
      "free set designer invoice",
      "set designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Set Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free set designer invoice template. Professional billing format with customizable fields for set designer services."
  },
  {
    "id": "shopify-developer",
    "name": "Shopify Developer",
    "profession": "Shopify Developer",
    "title": "Shopify Developer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for shopify developers and related business professionals.",
    "keywords": [
      "shopify developer invoice template",
      "invoice template for shopify developer",
      "shopify developer billing template",
      "free shopify developer invoice",
      "shopify developer invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Shopify Developers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free shopify developer invoice template. Professional billing format with customizable fields for shopify developer services."
  },
  {
    "id": "shopify-store",
    "name": "Shopify Store",
    "profession": "Shopify Store",
    "title": "Shopify Store Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for shopify stores and related business professionals.",
    "keywords": [
      "shopify store invoice template",
      "invoice template for shopify store",
      "shopify store billing template",
      "free shopify store invoice",
      "shopify store invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Shopify Stores typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free shopify store invoice template. Professional billing format with customizable fields for shopify store services."
  },
  {
    "id": "short-term-rental-cleaning",
    "name": "Short Term Rental Cleaning",
    "profession": "Short Term Rental Cleaning",
    "title": "Short Term Rental Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for short term rental cleanings and related business professionals.",
    "keywords": [
      "short term rental cleaning invoice template",
      "invoice template for short term rental cleaning",
      "short term rental cleaning billing template",
      "free short term rental cleaning invoice",
      "short term rental cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Short Term Rental Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free short term rental cleaning invoice template. Professional billing format with customizable fields for short term rental cleaning services."
  },
  {
    "id": "shuttle-service",
    "name": "Shuttle Service",
    "profession": "Shuttle Service",
    "title": "Shuttle Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for shuttle services and related service professionals.",
    "keywords": [
      "shuttle service invoice template",
      "invoice template for shuttle service",
      "shuttle service billing template",
      "free shuttle service invoice",
      "shuttle service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Shuttle Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free shuttle service invoice template. Professional billing format with customizable fields for shuttle service services."
  },
  {
    "id": "siding-installer",
    "name": "Siding Installer",
    "profession": "Siding Installer",
    "title": "Siding Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for siding installers and related business professionals.",
    "keywords": [
      "siding installer invoice template",
      "invoice template for siding installer",
      "siding installer billing template",
      "free siding installer invoice",
      "siding installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Siding Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free siding installer invoice template. Professional billing format with customizable fields for siding installer services."
  },
  {
    "id": "sign-maker",
    "name": "Sign Maker",
    "profession": "Sign Maker",
    "title": "Sign Maker Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for sign makers and related business professionals.",
    "keywords": [
      "sign maker invoice template",
      "invoice template for sign maker",
      "sign maker billing template",
      "free sign maker invoice",
      "sign maker invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Sign Makers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sign maker invoice template. Professional billing format with customizable fields for sign maker services."
  },
  {
    "id": "smart-home-installer",
    "name": "Smart Home Installer",
    "profession": "Smart Home Installer",
    "title": "Smart Home Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for smart home installers and related business professionals.",
    "keywords": [
      "smart home installer invoice template",
      "invoice template for smart home installer",
      "smart home installer billing template",
      "free smart home installer invoice",
      "smart home installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Smart Home Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free smart home installer invoice template. Professional billing format with customizable fields for smart home installer services."
  },
  {
    "id": "snow-removal",
    "name": "Snow Removal",
    "profession": "Snow Removal",
    "title": "Snow Removal Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for snow removals and related business professionals.",
    "keywords": [
      "snow removal invoice template",
      "invoice template for snow removal",
      "snow removal billing template",
      "free snow removal invoice",
      "snow removal invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Snow Removals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free snow removal invoice template. Professional billing format with customizable fields for snow removal services."
  },
  {
    "id": "soccer-coach",
    "name": "Soccer Coach",
    "profession": "Soccer Coach",
    "title": "Soccer Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for soccer coachs and related business professionals.",
    "keywords": [
      "soccer coach invoice template",
      "invoice template for soccer coach",
      "soccer coach billing template",
      "free soccer coach invoice",
      "soccer coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Soccer Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free soccer coach invoice template. Professional billing format with customizable fields for soccer coach services."
  },
  {
    "id": "social-media-manager",
    "name": "Social Media Manager",
    "profession": "Social Media Manager",
    "title": "Social Media Manager Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for social media managers and related business professionals.",
    "keywords": [
      "social media manager invoice template",
      "invoice template for social media manager",
      "social media manager billing template",
      "free social media manager invoice",
      "social media manager invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Social Media Managers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free social media manager invoice template. Professional billing format with customizable fields for social media manager services."
  },
  {
    "id": "sod-installation",
    "name": "Sod Installation",
    "profession": "Sod Installation",
    "title": "Sod Installation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for sod installations and related business professionals.",
    "keywords": [
      "sod installation invoice template",
      "invoice template for sod installation",
      "sod installation billing template",
      "free sod installation invoice",
      "sod installation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Sod Installations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sod installation invoice template. Professional billing format with customizable fields for sod installation services."
  },
  {
    "id": "software-developer",
    "name": "Software Developer",
    "profession": "Software Developer",
    "title": "Software Developer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for software developers and related business professionals.",
    "keywords": [
      "software developer invoice template",
      "invoice template for software developer",
      "software developer billing template",
      "free software developer invoice",
      "software developer invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$50-150",
      "project": "$1000-50000"
    },
    "industryInfo": "Software Developers typically charge between $50-150 per hour depending on experience and project complexity.",
    "seoDescription": "Free software developer invoice template. Professional billing format with customizable fields for software developer services."
  },
  {
    "id": "software-development",
    "name": "Software Development",
    "profession": "Software Development",
    "title": "Software Development Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for software developments and related business professionals.",
    "keywords": [
      "software development invoice template",
      "invoice template for software development",
      "software development billing template",
      "free software development invoice",
      "software development invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Software Developments typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free software development invoice template. Professional billing format with customizable fields for software development services."
  },
  {
    "id": "solar-installer",
    "name": "Solar Installer",
    "profession": "Solar Installer",
    "title": "Solar Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for solar installers and related business professionals.",
    "keywords": [
      "solar installer invoice template",
      "invoice template for solar installer",
      "solar installer billing template",
      "free solar installer invoice",
      "solar installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Solar Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free solar installer invoice template. Professional billing format with customizable fields for solar installer services."
  },
  {
    "id": "solar-panel-cleaning",
    "name": "Solar Panel Cleaning",
    "profession": "Solar Panel Cleaning",
    "title": "Solar Panel Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for solar panel cleanings and related business professionals.",
    "keywords": [
      "solar panel cleaning invoice template",
      "invoice template for solar panel cleaning",
      "solar panel cleaning billing template",
      "free solar panel cleaning invoice",
      "solar panel cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Solar Panel Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free solar panel cleaning invoice template. Professional billing format with customizable fields for solar panel cleaning services."
  },
  {
    "id": "sound-designer",
    "name": "Sound Designer",
    "profession": "Sound Designer",
    "title": "Sound Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for sound designers and related business professionals.",
    "keywords": [
      "sound designer invoice template",
      "invoice template for sound designer",
      "sound designer billing template",
      "free sound designer invoice",
      "sound designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Sound Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sound designer invoice template. Professional billing format with customizable fields for sound designer services."
  },
  {
    "id": "speech-therapist",
    "name": "Speech Therapist",
    "profession": "Speech Therapist",
    "title": "Speech Therapist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for speech therapists and related business professionals.",
    "keywords": [
      "speech therapist invoice template",
      "invoice template for speech therapist",
      "speech therapist billing template",
      "free speech therapist invoice",
      "speech therapist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Speech Therapists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free speech therapist invoice template. Professional billing format with customizable fields for speech therapist services."
  },
  {
    "id": "spray-tan-artist",
    "name": "Spray Tan Artist",
    "profession": "Spray Tan Artist",
    "title": "Spray Tan Artist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for spray tan artists and related business professionals.",
    "keywords": [
      "spray tan artist invoice template",
      "invoice template for spray tan artist",
      "spray tan artist billing template",
      "free spray tan artist invoice",
      "spray tan artist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Spray Tan Artists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free spray tan artist invoice template. Professional billing format with customizable fields for spray tan artist services."
  },
  {
    "id": "sprinkler-repair",
    "name": "Sprinkler Repair",
    "profession": "Sprinkler Repair",
    "title": "Sprinkler Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for sprinkler repairs and related business professionals.",
    "keywords": [
      "sprinkler repair invoice template",
      "invoice template for sprinkler repair",
      "sprinkler repair billing template",
      "free sprinkler repair invoice",
      "sprinkler repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Sprinkler Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sprinkler repair invoice template. Professional billing format with customizable fields for sprinkler repair services."
  },
  {
    "id": "squarespace-designer",
    "name": "Squarespace Designer",
    "profession": "Squarespace Designer",
    "title": "Squarespace Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for squarespace designers and related business professionals.",
    "keywords": [
      "squarespace designer invoice template",
      "invoice template for squarespace designer",
      "squarespace designer billing template",
      "free squarespace designer invoice",
      "squarespace designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Squarespace Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free squarespace designer invoice template. Professional billing format with customizable fields for squarespace designer services."
  },
  {
    "id": "staffing-agency",
    "name": "Staffing Agency",
    "profession": "Staffing Agency",
    "title": "Staffing Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for staffing agencys and related business professionals.",
    "keywords": [
      "staffing agency invoice template",
      "invoice template for staffing agency",
      "staffing agency billing template",
      "free staffing agency invoice",
      "staffing agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Staffing Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free staffing agency invoice template. Professional billing format with customizable fields for staffing agency services."
  },
  {
    "id": "staging-rental",
    "name": "Staging Rental",
    "profession": "Staging Rental",
    "title": "Staging Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for staging rentals and related business professionals.",
    "keywords": [
      "staging rental invoice template",
      "invoice template for staging rental",
      "staging rental billing template",
      "free staging rental invoice",
      "staging rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Staging Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free staging rental invoice template. Professional billing format with customizable fields for staging rental services."
  },
  {
    "id": "stone-restoration",
    "name": "Stone Restoration",
    "profession": "Stone Restoration",
    "title": "Stone Restoration Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for stone restorations and related business professionals.",
    "keywords": [
      "stone restoration invoice template",
      "invoice template for stone restoration",
      "stone restoration billing template",
      "free stone restoration invoice",
      "stone restoration invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Stone Restorations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free stone restoration invoice template. Professional billing format with customizable fields for stone restoration services."
  },
  {
    "id": "structural-engineer",
    "name": "Structural Engineer",
    "profession": "Structural Engineer",
    "title": "Structural Engineer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for structural engineers and related business professionals.",
    "keywords": [
      "structural engineer invoice template",
      "invoice template for structural engineer",
      "structural engineer billing template",
      "free structural engineer invoice",
      "structural engineer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Structural Engineers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free structural engineer invoice template. Professional billing format with customizable fields for structural engineer services."
  },
  {
    "id": "stump-removal",
    "name": "Stump Removal",
    "profession": "Stump Removal",
    "title": "Stump Removal Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for stump removals and related business professionals.",
    "keywords": [
      "stump removal invoice template",
      "invoice template for stump removal",
      "stump removal billing template",
      "free stump removal invoice",
      "stump removal invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Stump Removals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free stump removal invoice template. Professional billing format with customizable fields for stump removal services."
  },
  {
    "id": "subcontractor",
    "name": "Subcontractor",
    "profession": "Subcontractor",
    "title": "Subcontractor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for subcontractors and related business professionals.",
    "keywords": [
      "subcontractor invoice template",
      "invoice template for subcontractor",
      "subcontractor billing template",
      "free subcontractor invoice",
      "subcontractor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Subcontractors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free subcontractor invoice template. Professional billing format with customizable fields for subcontractor services."
  },
  {
    "id": "swim-instructor",
    "name": "Swim Instructor",
    "profession": "Swim Instructor",
    "title": "Swim Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for swim instructors and related business professionals.",
    "keywords": [
      "swim instructor invoice template",
      "invoice template for swim instructor",
      "swim instructor billing template",
      "free swim instructor invoice",
      "swim instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Swim Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free swim instructor invoice template. Professional billing format with customizable fields for swim instructor services."
  },
  {
    "id": "sysadmin",
    "name": "Sysadmin",
    "profession": "Sysadmin",
    "title": "Sysadmin Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for sysadmins and related business professionals.",
    "keywords": [
      "sysadmin invoice template",
      "invoice template for sysadmin",
      "sysadmin billing template",
      "free sysadmin invoice",
      "sysadmin invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Sysadmins typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free sysadmin invoice template. Professional billing format with customizable fields for sysadmin services."
  },
  {
    "id": "tattoo-artist",
    "name": "Tattoo Artist",
    "profession": "Tattoo Artist",
    "title": "Tattoo Artist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tattoo artists and related business professionals.",
    "keywords": [
      "tattoo artist invoice template",
      "invoice template for tattoo artist",
      "tattoo artist billing template",
      "free tattoo artist invoice",
      "tattoo artist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tattoo Artists typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tattoo artist invoice template. Professional billing format with customizable fields for tattoo artist services."
  },
  {
    "id": "tax-consultant",
    "name": "Tax Consultant",
    "profession": "Tax Consultant",
    "title": "Tax Consultant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tax consultants and related business professionals.",
    "keywords": [
      "tax consultant invoice template",
      "invoice template for tax consultant",
      "tax consultant billing template",
      "free tax consultant invoice",
      "tax consultant invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tax Consultants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tax consultant invoice template. Professional billing format with customizable fields for tax consultant services."
  },
  {
    "id": "tax-preparer",
    "name": "Tax Preparer",
    "profession": "Tax Preparer",
    "title": "Tax Preparer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tax preparers and related business professionals.",
    "keywords": [
      "tax preparer invoice template",
      "invoice template for tax preparer",
      "tax preparer billing template",
      "free tax preparer invoice",
      "tax preparer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tax Preparers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tax preparer invoice template. Professional billing format with customizable fields for tax preparer services."
  },
  {
    "id": "taxi-service",
    "name": "Taxi Service",
    "profession": "Taxi Service",
    "title": "Taxi Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for taxi services and related service professionals.",
    "keywords": [
      "taxi service invoice template",
      "invoice template for taxi service",
      "taxi service billing template",
      "free taxi service invoice",
      "taxi service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Taxi Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free taxi service invoice template. Professional billing format with customizable fields for taxi service services."
  },
  {
    "id": "technical-writer",
    "name": "Technical Writer",
    "profession": "Technical Writer",
    "title": "Technical Writer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for technical writers and related business professionals.",
    "keywords": [
      "technical writer invoice template",
      "invoice template for technical writer",
      "technical writer billing template",
      "free technical writer invoice",
      "technical writer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Technical Writers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free technical writer invoice template. Professional billing format with customizable fields for technical writer services."
  },
  {
    "id": "tennis-coach",
    "name": "Tennis Coach",
    "profession": "Tennis Coach",
    "title": "Tennis Coach Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tennis coachs and related business professionals.",
    "keywords": [
      "tennis coach invoice template",
      "invoice template for tennis coach",
      "tennis coach billing template",
      "free tennis coach invoice",
      "tennis coach invoice format"
    ],
    "commonServices": [
      "Strategy consulting",
      "Process improvement",
      "Analysis and recommendations",
      "Training"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tennis Coachs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tennis coach invoice template. Professional billing format with customizable fields for tennis coach services."
  },
  {
    "id": "tent-rental",
    "name": "Tent Rental",
    "profession": "Tent Rental",
    "title": "Tent Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tent rentals and related business professionals.",
    "keywords": [
      "tent rental invoice template",
      "invoice template for tent rental",
      "tent rental billing template",
      "free tent rental invoice",
      "tent rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tent Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tent rental invoice template. Professional billing format with customizable fields for tent rental services."
  },
  {
    "id": "test-prep-tutor",
    "name": "Test Prep Tutor",
    "profession": "Test Prep Tutor",
    "title": "Test Prep Tutor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for test prep tutors and related business professionals.",
    "keywords": [
      "test prep tutor invoice template",
      "invoice template for test prep tutor",
      "test prep tutor billing template",
      "free test prep tutor invoice",
      "test prep tutor invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Test Prep Tutors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free test prep tutor invoice template. Professional billing format with customizable fields for test prep tutor services."
  },
  {
    "id": "therapist",
    "name": "Therapist",
    "profession": "Therapist",
    "title": "Therapist Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for therapists and related business professionals.",
    "keywords": [
      "therapist invoice template",
      "invoice template for therapist",
      "therapist billing template",
      "free therapist invoice",
      "therapist invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$100-400",
      "project": "$200-5000"
    },
    "industryInfo": "Therapists typically charge between $100-400 per hour depending on experience and project complexity.",
    "seoDescription": "Free therapist invoice template. Professional billing format with customizable fields for therapist services."
  },
  {
    "id": "tile-installer",
    "name": "Tile Installer",
    "profession": "Tile Installer",
    "title": "Tile Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tile installers and related business professionals.",
    "keywords": [
      "tile installer invoice template",
      "invoice template for tile installer",
      "tile installer billing template",
      "free tile installer invoice",
      "tile installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tile Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tile installer invoice template. Professional billing format with customizable fields for tile installer services."
  },
  {
    "id": "towing-service",
    "name": "Towing Service",
    "profession": "Towing Service",
    "title": "Towing Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for towing services and related service professionals.",
    "keywords": [
      "towing service invoice template",
      "invoice template for towing service",
      "towing service billing template",
      "free towing service invoice",
      "towing service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Towing Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free towing service invoice template. Professional billing format with customizable fields for towing service services."
  },
  {
    "id": "translation-service",
    "name": "Translation Service",
    "profession": "Translation Service",
    "title": "Translation Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for translation services and related service professionals.",
    "keywords": [
      "translation service invoice template",
      "invoice template for translation service",
      "translation service billing template",
      "free translation service invoice",
      "translation service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Translation Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free translation service invoice template. Professional billing format with customizable fields for translation service services."
  },
  {
    "id": "translator",
    "name": "Translator",
    "profession": "Translator",
    "title": "Translator Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for translators and related business professionals.",
    "keywords": [
      "translator invoice template",
      "invoice template for translator",
      "translator billing template",
      "free translator invoice",
      "translator invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Translators typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free translator invoice template. Professional billing format with customizable fields for translator services."
  },
  {
    "id": "transportation",
    "name": "Transportation",
    "profession": "Transportation",
    "title": "Transportation Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for transportations and related business professionals.",
    "keywords": [
      "transportation invoice template",
      "invoice template for transportation",
      "transportation billing template",
      "free transportation invoice",
      "transportation invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Transportations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free transportation invoice template. Professional billing format with customizable fields for transportation services."
  },
  {
    "id": "travel-agency",
    "name": "Travel Agency",
    "profession": "Travel Agency",
    "title": "Travel Agency Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for travel agencys and related business professionals.",
    "keywords": [
      "travel agency invoice template",
      "invoice template for travel agency",
      "travel agency billing template",
      "free travel agency invoice",
      "travel agency invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Travel Agencys typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free travel agency invoice template. Professional billing format with customizable fields for travel agency services."
  },
  {
    "id": "tree-removal",
    "name": "Tree Removal",
    "profession": "Tree Removal",
    "title": "Tree Removal Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tree removals and related business professionals.",
    "keywords": [
      "tree removal invoice template",
      "invoice template for tree removal",
      "tree removal billing template",
      "free tree removal invoice",
      "tree removal invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tree Removals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tree removal invoice template. Professional billing format with customizable fields for tree removal services."
  },
  {
    "id": "tree-service",
    "name": "Tree Service",
    "profession": "Tree Service",
    "title": "Tree Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tree services and related service professionals.",
    "keywords": [
      "tree service invoice template",
      "invoice template for tree service",
      "tree service billing template",
      "free tree service invoice",
      "tree service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tree Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tree service invoice template. Professional billing format with customizable fields for tree service services."
  },
  {
    "id": "tree-trimming",
    "name": "Tree Trimming",
    "profession": "Tree Trimming",
    "title": "Tree Trimming Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tree trimmings and related business professionals.",
    "keywords": [
      "tree trimming invoice template",
      "invoice template for tree trimming",
      "tree trimming billing template",
      "free tree trimming invoice",
      "tree trimming invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tree Trimmings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tree trimming invoice template. Professional billing format with customizable fields for tree trimming services."
  },
  {
    "id": "trucking",
    "name": "Trucking",
    "profession": "Trucking",
    "title": "Trucking Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for truckings and related business professionals.",
    "keywords": [
      "trucking invoice template",
      "invoice template for trucking",
      "trucking billing template",
      "free trucking invoice",
      "trucking invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Truckings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free trucking invoice template. Professional billing format with customizable fields for trucking services."
  },
  {
    "id": "tshirt-printing",
    "name": "Tshirt Printing",
    "profession": "Tshirt Printing",
    "title": "Tshirt Printing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tshirt printings and related business professionals.",
    "keywords": [
      "tshirt printing invoice template",
      "invoice template for tshirt printing",
      "tshirt printing billing template",
      "free tshirt printing invoice",
      "tshirt printing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tshirt Printings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tshirt printing invoice template. Professional billing format with customizable fields for tshirt printing services."
  },
  {
    "id": "tutor",
    "name": "Tutor",
    "profession": "Tutor",
    "title": "Tutor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tutors and related business professionals.",
    "keywords": [
      "tutor invoice template",
      "invoice template for tutor",
      "tutor billing template",
      "free tutor invoice",
      "tutor invoice format"
    ],
    "commonServices": [
      "One-on-one tutoring",
      "Group sessions",
      "Test preparation",
      "Homework help"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tutors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tutor invoice template. Professional billing format with customizable fields for tutor services."
  },
  {
    "id": "tv-mounting",
    "name": "Tv Mounting",
    "profession": "Tv Mounting",
    "title": "Tv Mounting Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for tv mountings and related business professionals.",
    "keywords": [
      "tv mounting invoice template",
      "invoice template for tv mounting",
      "tv mounting billing template",
      "free tv mounting invoice",
      "tv mounting invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Tv Mountings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free tv mounting invoice template. Professional billing format with customizable fields for tv mounting services."
  },
  {
    "id": "ui-design",
    "name": "Ui Design",
    "profession": "Ui Design",
    "title": "Ui Design Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for ui designs and related business professionals.",
    "keywords": [
      "ui design invoice template",
      "invoice template for ui design",
      "ui design billing template",
      "free ui design invoice",
      "ui design invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Ui Designs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free ui design invoice template. Professional billing format with customizable fields for ui design services."
  },
  {
    "id": "ui-ux-auditor",
    "name": "Ui Ux Auditor",
    "profession": "Ui Ux Auditor",
    "title": "Ui Ux Auditor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for ui ux auditors and related business professionals.",
    "keywords": [
      "ui ux auditor invoice template",
      "invoice template for ui ux auditor",
      "ui ux auditor billing template",
      "free ui ux auditor invoice",
      "ui ux auditor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Ui Ux Auditors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free ui ux auditor invoice template. Professional billing format with customizable fields for ui ux auditor services."
  },
  {
    "id": "ux-ui-designer",
    "name": "Ux Ui Designer",
    "profession": "Ux Ui Designer",
    "title": "Ux Ui Designer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for ux ui designers and related business professionals.",
    "keywords": [
      "ux ui designer invoice template",
      "invoice template for ux ui designer",
      "ux ui designer billing template",
      "free ux ui designer invoice",
      "ux ui designer invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Ux Ui Designers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free ux ui designer invoice template. Professional billing format with customizable fields for ux ui designer services."
  },
  {
    "id": "venue-rental",
    "name": "Venue Rental",
    "profession": "Venue Rental",
    "title": "Venue Rental Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for venue rentals and related business professionals.",
    "keywords": [
      "venue rental invoice template",
      "invoice template for venue rental",
      "venue rental billing template",
      "free venue rental invoice",
      "venue rental invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Venue Rentals typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free venue rental invoice template. Professional billing format with customizable fields for venue rental services."
  },
  {
    "id": "video-editing",
    "name": "Video Editing",
    "profession": "Video Editing",
    "title": "Video Editing Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for video editings and related business professionals.",
    "keywords": [
      "video editing invoice template",
      "invoice template for video editing",
      "video editing billing template",
      "free video editing invoice",
      "video editing invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Video Editings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free video editing invoice template. Professional billing format with customizable fields for video editing services."
  },
  {
    "id": "video-producer",
    "name": "Video Producer",
    "profession": "Video Producer",
    "title": "Video Producer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for video producers and related business professionals.",
    "keywords": [
      "video producer invoice template",
      "invoice template for video producer",
      "video producer billing template",
      "free video producer invoice",
      "video producer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Video Producers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free video producer invoice template. Professional billing format with customizable fields for video producer services."
  },
  {
    "id": "videographer",
    "name": "Videographer",
    "profession": "Videographer",
    "title": "Videographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for videographers and related business professionals.",
    "keywords": [
      "videographer invoice template",
      "invoice template for videographer",
      "videographer billing template",
      "free videographer invoice",
      "videographer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$35-100",
      "project": "$500-10000"
    },
    "industryInfo": "Videographers typically charge between $35-100 per hour depending on experience and project complexity.",
    "seoDescription": "Free videographer invoice template. Professional billing format with customizable fields for videographer services."
  },
  {
    "id": "vinyl-wrap-installer",
    "name": "Vinyl Wrap Installer",
    "profession": "Vinyl Wrap Installer",
    "title": "Vinyl Wrap Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for vinyl wrap installers and related business professionals.",
    "keywords": [
      "vinyl wrap installer invoice template",
      "invoice template for vinyl wrap installer",
      "vinyl wrap installer billing template",
      "free vinyl wrap installer invoice",
      "vinyl wrap installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Vinyl Wrap Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free vinyl wrap installer invoice template. Professional billing format with customizable fields for vinyl wrap installer services."
  },
  {
    "id": "virtual-assistant",
    "name": "Virtual Assistant",
    "profession": "Virtual Assistant",
    "title": "Virtual Assistant Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for virtual assistants and related business professionals.",
    "keywords": [
      "virtual assistant invoice template",
      "invoice template for virtual assistant",
      "virtual assistant billing template",
      "free virtual assistant invoice",
      "virtual assistant invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Virtual Assistants typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free virtual assistant invoice template. Professional billing format with customizable fields for virtual assistant services."
  },
  {
    "id": "voice-actor",
    "name": "Voice Actor",
    "profession": "Voice Actor",
    "title": "Voice Actor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for voice actors and related business professionals.",
    "keywords": [
      "voice actor invoice template",
      "invoice template for voice actor",
      "voice actor billing template",
      "free voice actor invoice",
      "voice actor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Voice Actors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free voice actor invoice template. Professional billing format with customizable fields for voice actor services."
  },
  {
    "id": "warehouse-services",
    "name": "Warehouse Services",
    "profession": "Warehouse Services",
    "title": "Warehouse Services Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for warehouse servicess and related service professionals.",
    "keywords": [
      "warehouse services invoice template",
      "invoice template for warehouse services",
      "warehouse services billing template",
      "free warehouse services invoice",
      "warehouse services invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Warehouse Servicess typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free warehouse services invoice template. Professional billing format with customizable fields for warehouse services services."
  },
  {
    "id": "water-damage-restoration",
    "name": "Water Damage Restoration",
    "profession": "Water Damage Restoration",
    "title": "Water Damage Restoration Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for water damage restorations and related business professionals.",
    "keywords": [
      "water damage restoration invoice template",
      "invoice template for water damage restoration",
      "water damage restoration billing template",
      "free water damage restoration invoice",
      "water damage restoration invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Water Damage Restorations typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free water damage restoration invoice template. Professional billing format with customizable fields for water damage restoration services."
  },
  {
    "id": "water-well-service",
    "name": "Water Well Service",
    "profession": "Water Well Service",
    "title": "Water Well Service Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for water well services and related service professionals.",
    "keywords": [
      "water well service invoice template",
      "invoice template for water well service",
      "water well service billing template",
      "free water well service invoice",
      "water well service invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Water Well Services typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free water well service invoice template. Professional billing format with customizable fields for water well service services."
  },
  {
    "id": "web-design",
    "name": "Web Design",
    "profession": "Web Design",
    "title": "Web Design Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for web designs and related business professionals.",
    "keywords": [
      "web design invoice template",
      "invoice template for web design",
      "web design billing template",
      "free web design invoice",
      "web design invoice format"
    ],
    "commonServices": [
      "Logo design",
      "Brand identity",
      "Print design",
      "Digital design"
    ],
    "averageRates": {
      "hourly": "$35-100",
      "project": "$500-10000"
    },
    "industryInfo": "Web Designs typically charge between $35-100 per hour depending on experience and project complexity.",
    "seoDescription": "Free web design invoice template. Professional billing format with customizable fields for web design services."
  },
  {
    "id": "web-developer",
    "name": "Web Developer",
    "profession": "Web Developer",
    "title": "Web Developer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for web developers and related business professionals.",
    "keywords": [
      "web developer invoice template",
      "invoice template for web developer",
      "web developer billing template",
      "free web developer invoice",
      "web developer invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$50-150",
      "project": "$1000-50000"
    },
    "industryInfo": "Web Developers typically charge between $50-150 per hour depending on experience and project complexity.",
    "seoDescription": "Free web developer invoice template. Professional billing format with customizable fields for web developer services."
  },
  {
    "id": "webflow-developer",
    "name": "Webflow Developer",
    "profession": "Webflow Developer",
    "title": "Webflow Developer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for webflow developers and related business professionals.",
    "keywords": [
      "webflow developer invoice template",
      "invoice template for webflow developer",
      "webflow developer billing template",
      "free webflow developer invoice",
      "webflow developer invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Webflow Developers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free webflow developer invoice template. Professional billing format with customizable fields for webflow developer services."
  },
  {
    "id": "wedding-photographer",
    "name": "Wedding Photographer",
    "profession": "Wedding Photographer",
    "title": "Wedding Photographer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for wedding photographers and related business professionals.",
    "keywords": [
      "wedding photographer invoice template",
      "invoice template for wedding photographer",
      "wedding photographer billing template",
      "free wedding photographer invoice",
      "wedding photographer invoice format"
    ],
    "commonServices": [
      "Photo sessions",
      "Photo editing",
      "Digital delivery",
      "Print packages"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Wedding Photographers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free wedding photographer invoice template. Professional billing format with customizable fields for wedding photographer services."
  },
  {
    "id": "wedding-planner",
    "name": "Wedding Planner",
    "profession": "Wedding Planner",
    "title": "Wedding Planner Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for wedding planners and related business professionals.",
    "keywords": [
      "wedding planner invoice template",
      "invoice template for wedding planner",
      "wedding planner billing template",
      "free wedding planner invoice",
      "wedding planner invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Wedding Planners typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free wedding planner invoice template. Professional billing format with customizable fields for wedding planner services."
  },
  {
    "id": "welder",
    "name": "Welder",
    "profession": "Welder",
    "title": "Welder Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for welders and related business professionals.",
    "keywords": [
      "welder invoice template",
      "invoice template for welder",
      "welder billing template",
      "free welder invoice",
      "welder invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Welders typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free welder invoice template. Professional billing format with customizable fields for welder services."
  },
  {
    "id": "window-cleaning",
    "name": "Window Cleaning",
    "profession": "Window Cleaning",
    "title": "Window Cleaning Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for window cleanings and related business professionals.",
    "keywords": [
      "window cleaning invoice template",
      "invoice template for window cleaning",
      "window cleaning billing template",
      "free window cleaning invoice",
      "window cleaning invoice format"
    ],
    "commonServices": [
      "Deep cleaning",
      "Regular maintenance",
      "Move-in/move-out cleaning",
      "Post-construction cleanup"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Window Cleanings typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free window cleaning invoice template. Professional billing format with customizable fields for window cleaning services."
  },
  {
    "id": "window-installer",
    "name": "Window Installer",
    "profession": "Window Installer",
    "title": "Window Installer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for window installers and related business professionals.",
    "keywords": [
      "window installer invoice template",
      "invoice template for window installer",
      "window installer billing template",
      "free window installer invoice",
      "window installer invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Window Installers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free window installer invoice template. Professional billing format with customizable fields for window installer services."
  },
  {
    "id": "windshield-repair",
    "name": "Windshield Repair",
    "profession": "Windshield Repair",
    "title": "Windshield Repair Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for windshield repairs and related business professionals.",
    "keywords": [
      "windshield repair invoice template",
      "invoice template for windshield repair",
      "windshield repair billing template",
      "free windshield repair invoice",
      "windshield repair invoice format"
    ],
    "commonServices": [
      "Diagnostics",
      "Repairs",
      "Maintenance",
      "Emergency services"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Windshield Repairs typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free windshield repair invoice template. Professional billing format with customizable fields for windshield repair services."
  },
  {
    "id": "wordpress-developer",
    "name": "Wordpress Developer",
    "profession": "Wordpress Developer",
    "title": "Wordpress Developer Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for wordpress developers and related business professionals.",
    "keywords": [
      "wordpress developer invoice template",
      "invoice template for wordpress developer",
      "wordpress developer billing template",
      "free wordpress developer invoice",
      "wordpress developer invoice format"
    ],
    "commonServices": [
      "Website development",
      "Custom applications",
      "Bug fixes",
      "Maintenance"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Wordpress Developers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free wordpress developer invoice template. Professional billing format with customizable fields for wordpress developer services."
  },
  {
    "id": "yoga-instructor",
    "name": "Yoga Instructor",
    "profession": "Yoga Instructor",
    "title": "Yoga Instructor Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for yoga instructors and related business professionals.",
    "keywords": [
      "yoga instructor invoice template",
      "invoice template for yoga instructor",
      "yoga instructor billing template",
      "free yoga instructor invoice",
      "yoga instructor invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Yoga Instructors typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free yoga instructor invoice template. Professional billing format with customizable fields for yoga instructor services."
  },
  {
    "id": "youtuber",
    "name": "Youtuber",
    "profession": "Youtuber",
    "title": "Youtuber Invoice Template (Free)",
    "description": "Professional invoice template designed specifically for youtubers and related business professionals.",
    "keywords": [
      "youtuber invoice template",
      "invoice template for youtuber",
      "youtuber billing template",
      "free youtuber invoice",
      "youtuber invoice format"
    ],
    "commonServices": [
      "Service consultation",
      "Project planning",
      "Implementation",
      "Follow-up support"
    ],
    "averageRates": {
      "hourly": "$30-80",
      "project": "$200-5000"
    },
    "industryInfo": "Youtubers typically charge between $30-80 per hour depending on experience and project complexity.",
    "seoDescription": "Free youtuber invoice template. Professional billing format with customizable fields for youtuber services."
  }
];

// Export profession slugs for static generation
export const professionSlugs = professions.map(p => p.id);
