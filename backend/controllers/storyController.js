// Static climate story definitions
// Each story contains: id, title, region, description, variable for viz, and related news keywords
const stories = [
  {
    id: "arctic-warming",
    title: "Arctic Warming",
    region: "Arctic",
    centerLat: 80,
    centerLon: 0,
    variable: "temperature",
    description:
      "The Arctic is warming nearly four times faster than the global average. Sea ice extent has declined dramatically since the 1980s, opening new shipping routes but disrupting ecosystems.",
    highlight: "Temperature anomalies in the Arctic exceed +3°C above baseline in recent decades.",
    newsKeywords: ["arctic warming", "sea ice", "polar vortex"],
    imageUrl: null,
  },
  {
    id: "extreme-rainfall-india",
    title: "Extreme Rainfall Zones — India",
    region: "South Asia",
    centerLat: 22,
    centerLon: 80,
    variable: "precipitation",
    description:
      "Monsoon patterns in India are becoming increasingly erratic. Some regions experience intense flooding while others face unprecedented drought, stressing agricultural systems.",
    highlight: "Precipitation variability has increased by 20% since 1980 over peninsular India.",
    newsKeywords: ["India floods", "monsoon", "extreme rainfall India"],
    imageUrl: null,
  },
  {
    id: "rising-global-temperatures",
    title: "Rising Global Temperatures",
    region: "Global",
    centerLat: 0,
    centerLon: 0,
    variable: "temperature",
    description:
      "Global mean surface temperature has risen by ~1.2°C since pre-industrial times. The last decade (2013–2023) was the warmest on record, with accelerating warming driven by greenhouse gas emissions.",
    highlight: "2023 was the hottest year ever recorded, surpassing previous records by a significant margin.",
    newsKeywords: ["global warming", "climate change", "record temperatures"],
    imageUrl: null,
  },
];

// @desc  Get all climate stories
// @route GET /api/stories
// @access Public
export const getStories = (req, res) => {
  return res.status(200).json(stories);
};

// @desc  Get a single story by id
// @route GET /api/stories/:id
// @access Public
export const getStory = (req, res) => {
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ message: "Story not found" });
  return res.status(200).json(story);
};
