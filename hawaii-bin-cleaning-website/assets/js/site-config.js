window.HBC_CONFIG = {
  businessName: "Hawaii Bin Cleaning",
  tagline: "Cleaner Bins. Happier Homes. Cleaner Hawaiʻi.",
  siteUrl: "https://hawaiibincleaning.com",
  website: "hawaiibincleaning.com",
  socialHandle: "@hawaiibincleaning",
  serviceArea: "Oʻahu, Hawaiʻi",
  email: "info@hawaiibincleaning.com",
  phone: "",
  foundersDiscountUrl: "/founders-discount",
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/1PyIezZ0dCBFFLdjuHTehYTDU4E-6sOVnyPfHPNwOkK4/edit?resourcekey=&gid=1318085782#gid=1318085782",
  googleFormEditUrl: "https://docs.google.com/forms/u/1/d/1to0uoLZD0JB_d6blfTh9TdUxQcivxApMBmob0hI4K6c/edit?usp=forms_home&ouid=107997978444223972173&ths=true&pli=1",
  // Paste the deployed Google Apps Script Web App URL here after following the README setup.
  // The native website form submits to this endpoint, which writes rows to the Google Sheet above.
  googleAppsScriptEndpoint: "https://script.google.com/macros/s/AKfycbyYF3DNaplfeQ18liRXkyLogSY40nkeaPzrrMzx741wY1Aog-8J1FT4t28fboej8O_tsg/exec",
  // Optional backup only. The live customer page now uses a native website form instead of an embedded Google Form.
  googleFormPublicUrl: "https://docs.google.com/forms/d/1to0uoLZD0JB_d6blfTh9TdUxQcivxApMBmob0hI4K6c/viewform",
  // Replace these with live links from Jobber, Jobatory, Urable, or another booking platform.
  bookingUrl: "/founders-discount",
  customerPortalUrl: "/founders-discount",
  quoteUrl: "/founders-discount",
  // Hidden at launch. Change to true when ready, then also update robots.txt and sitemap.xml.
  showPricing: false,
  showBlog: false,
  nav: [
    { label: "Home", href: "/", key: "home" },
    { label: "About", href: "/about", key: "about" },
    { label: "Services", href: "/services", key: "services" },
    { label: "Pricing", href: "/pricing", key: "pricing", hiddenFlag: "showPricing" },
    { label: "Blog", href: "/blog", key: "blog", hiddenFlag: "showBlog" },
    { label: "FAQ", href: "/faq", key: "faq" }
  ]
};
