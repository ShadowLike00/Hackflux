const express = require("express");
const cors = require("cors");
const googleTrends = require("google-trends-api");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- SEO TITLE SCORE ---------------- */

function scoreTitle(title, keyword) {

  let score = 0;

  if (title.toLowerCase().includes(keyword.toLowerCase()))
    score += 30;

  if (title.length >= 50 && title.length <= 60)
    score += 20;

  if (/\d/.test(title))
    score += 15;

  if (title.includes("?"))
    score += 10;

  return score;
}

/* ---------------- FIND BEST TITLE ---------------- */

function findBestTitle(titles, keyword) {

  let bestScore = 0;
  let bestTitle = "";

  titles.forEach(title => {

    const score = scoreTitle(title, keyword);

    if (score > bestScore) {
      bestScore = score;
      bestTitle = title;
    }

  });

  return bestTitle;
}

/* ---------------- HOME ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("AI Content Intelligence API running 🚀");
});

/* ---------------- GOOGLE TRENDS ---------------- */

app.get("/trends/:keyword", async (req, res) => {

  const keyword = req.params.keyword;

  try {

    const results = await googleTrends.dailyTrends({
      geo: "US"
    });

    let data;

    try {
      data = JSON.parse(results);
    } catch (parseError) {

      console.log("Google blocked request. Using fallback trends.");

      return res.json({
        keyword: keyword,
        trends: [
          `${keyword} tools`,
          `${keyword} tutorial`,
          `${keyword} for beginners`,
          `best ${keyword} apps`,
          `${keyword} trends 2026`
        ]
      });

    }

    const trending = data.default.trendingSearchesDays[0].trendingSearches
      .map(item => item.title.query);

    const filtered = trending.filter(t =>
      t.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json({
      keyword: keyword,
      trends: filtered.length ? filtered : trending.slice(0,5)
    });

  } catch (error) {

    console.log("Trend API error:", error);

    res.json({
      keyword: keyword,
      trends: [
        `${keyword} tools`,
        `${keyword} tutorial`,
        `${keyword} strategies`,
        `${keyword} tips`,
        `${keyword} trends`
      ]
    });

  }

});

/* ---------------- TITLE GENERATOR ---------------- */

app.post("/generate-titles", (req, res) => {

  const keyword = req.body?.keyword;

  if (!keyword) {
    return res.status(400).json({
      message: "Keyword is required"
    });
  }

  const titles = [

    `10 Best ${keyword} Tips for Beginners`,
    `The Ultimate Guide to ${keyword} in 2026`,
    `How ${keyword} is Transforming Technology`,
    `Top 7 ${keyword} Trends You Should Know`,
    `Why ${keyword} Matters More Than Ever`,
    `${keyword}: Complete Beginner Guide`,
    `How to Master ${keyword} Fast`,
    `Is ${keyword} the Future of Innovation?`,
    `The Hidden Power of ${keyword}`,
    `Everything You Need to Know About ${keyword}`

  ];

  const bestTitle = findBestTitle(titles, keyword);

  res.json({
    titles,
    bestTitle
  });

});

/* ---------------- BLOG OUTLINE GENERATOR ---------------- */

app.post("/generate-outline", (req, res) => {

  const keyword = req.body?.keyword;

  if (!keyword) {
    return res.status(400).json({
      message: "Keyword is required"
    });
  }

  const outline = {

    title: `Complete Guide to ${keyword}`,

    sections: [

      {
        heading: `Introduction to ${keyword}`,
        subtopics: [
          `What is ${keyword}?`,
          `Why ${keyword} is important`,
          `How ${keyword} is evolving`
        ]
      },

      {
        heading: `Benefits of ${keyword}`,
        subtopics: [
          `Improved productivity`,
          `Automation advantages`,
          `Future potential`
        ]
      },

      {
        heading: `Best Practices for ${keyword}`,
        subtopics: [
          `Tips for beginners`,
          `Common mistakes`,
          `Expert strategies`
        ]
      },

      {
        heading: `Future of ${keyword}`,
        subtopics: [
          `Upcoming trends`,
          `Industry predictions`,
          `Opportunities`
        ]
      }

    ]

  };

  res.json(outline);

});

/* ---------------- SERVER ---------------- */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});