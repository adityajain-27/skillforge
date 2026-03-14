// Mock climate news articles
// In production: replace with real API calls to NewsAPI or GDELT
const mockArticles = [
  {
    id: 1,
    title: "Arctic Sea Ice Hits Record Low for Third Straight Year",
    source: "Climate Wire",
    url: "#",
    publishedAt: "2024-09-15",
    keywords: ["arctic warming", "sea ice", "polar vortex"],
    summary:
      "Arctic sea ice extent reached its lowest recorded minimum this September, raising alarm among climate scientists about feedback loops accelerating polar warming.",
  },
  {
    id: 2,
    title: "India Faces Catastrophic Floods as Monsoon Extremes Intensify",
    source: "The Guardian",
    url: "#",
    publishedAt: "2024-08-10",
    keywords: ["India floods", "monsoon", "extreme rainfall India"],
    summary:
      "Record monsoon rainfall led to severe flooding across Assam, Himachal Pradesh, and Uttarakhand in 2024, displacing millions and prompting climate adaptation calls.",
  },
  {
    id: 3,
    title: "2024 Is Now the Hottest Year in Recorded Human History",
    source: "NASA Earth Observatory",
    url: "#",
    publishedAt: "2024-12-01",
    keywords: ["global warming", "climate change", "record temperatures"],
    summary:
      "NASA and NOAA confirmed that 2024 shattered temperature records globally, with mean surface temperature reaching 1.35°C above the pre-industrial baseline.",
  },
  {
    id: 4,
    title: "Polar Vortex Disruption Linked to Arctic Amplification",
    source: "Nature Climate Change",
    url: "#",
    publishedAt: "2024-01-22",
    keywords: ["arctic warming", "polar vortex"],
    summary:
      "New research links the weakening of the polar vortex to increased Arctic warming, causing severe cold snaps across continental North America and Eurasia.",
  },
  {
    id: 5,
    title: "Kerala Declares State Emergency After Unprecedented Rainfall",
    source: "The Hindu",
    url: "#",
    publishedAt: "2024-07-19",
    keywords: ["India floods", "extreme rainfall India", "monsoon"],
    summary:
      "Kerala received 200% of its average July rainfall in just 5 days. Scientists attribute this to a supercharged monsoon driven by warmer Arabian Sea temperatures.",
  },
  {
    id: 6,
    title: "IPCC: World Risks Crossing 1.5°C Threshold Within a Decade",
    source: "IPCC",
    url: "#",
    publishedAt: "2024-03-20",
    keywords: ["global warming", "climate change"],
    summary:
      "The IPCC's updated synthesis warns that without major mitigation, the world will likely exceed 1.5°C of warming between 2030 and 2035.",
  },
];

// @desc  Get climate news, optionally filtered by keyword
// @route GET /api/news?q=keyword
// @access Public
export const getNews = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json(mockArticles);
  }

  const searchTerms = q.toLowerCase().split(",").map((t) => t.trim());
  const filtered = mockArticles.filter((article) =>
    article.keywords.some((kw) =>
      searchTerms.some((term) => kw.toLowerCase().includes(term))
    )
  );

  return res.status(200).json(filtered);
};
