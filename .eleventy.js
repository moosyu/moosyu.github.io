const htmlmin = require("html-minifier-terser");
const cleanCss = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownItKatex = require("@vscode/markdown-it-katex").default;
const markdownItFootnote = require("markdown-it-footnote")
const markdownItTaskList = require("markdown-it-task-lists");
const fs = require("fs")
const setPort = 5501;
const { DateTime } = require("luxon");
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const buildTarget = process.env.DEPLOY_TARGET || "local";

module.exports = function(eleventyConfig) {
  eleventyConfig.on("beforeBuild", () => {
    console.log("⏳ Build starting...");
  });

  eleventyConfig.addFilter("dateConvert", (dateInput, format = "MMM d, yyyy") => {
    if (!dateInput) return "";
    return DateTime.fromISO(dateInput).toFormat(format);
  });

  eleventyConfig.addFilter("wordCount", (content) => {
    return content.replace(/(<([^>]+)>)/gi, "").split(/\s+/).length;
  });

  eleventyConfig.addFilter("readTime", (content) => {
    let wordCount = content ? content.replace(/(<([^>]+)>)/gi, "").split(/\s+/).length : 0;
    return Math.ceil(wordCount / 200);
  });

  eleventyConfig.addNunjucksFilter("formatDate", function(value) {
    return value.toString().padStart(2, '0');
  });

  eleventyConfig.addNunjucksFilter("convertNumMonth", function(value) {
    return monthNames[value - 1];
  });

  // convert object into an array so it can be reversed
  eleventyConfig.addNunjucksFilter("entriesConverter", function(obj) {
    return Object.entries(obj);
  });

  eleventyConfig.addShortcode("latestCalendarUrl", function() {
    const calendarData = this.ctx.collections.calendarData;
    const latest = calendarData[calendarData.length - 1];
    return `/pages/ramblings/calendar/${latest.year}/${latest.month.toString().padStart(2, '0')}/`;
  });

  eleventyConfig.addPassthroughCopy({
    "public/assets": "assets",
    "public/fonts": "fonts",
    "public/favicon.ico": "favicon.ico",
    "src/nekofm.css" : "nekofm.css",
    "src/elements.css" : "elements.css",
    "src/pages/musicring/sitesMusicRing.json" : "sitesMusicRing.json"
  });
  eleventyConfig.addPassthroughCopy("src/_data/*");
  eleventyConfig.addPassthroughCopy("src/css/*");
  eleventyConfig.addPassthroughCopy("src/js/*");
  eleventyConfig.addPassthroughCopy(".well-known/*");
  eleventyConfig.setServerOptions({
    liveReload: true,
    port: setPort,
  });

  // lots of comments bc the moment i look away from this shit i forget what is even going on anymore this took way too long...
  eleventyConfig.addCollection("pageTree", function (collectionApi) {
      /*
      what tree look a bit like so i dont forget later:
      /pages/ and /pages/blog/

      {
        pages: {
          __data: { ... },
          __children: {
            blog: {
              __data: { ... },
              __children: {}
            }
        }
      }
    */
    const pages = collectionApi.getAll();
    const tree = {};

    pages.forEach(page => {
      const parts = page.url.split("/").filter(Boolean); // splits url into parts and gets rid of unusable empty strings caused by leading or trailing slashes. thanks mr michael uloth https://michaeluloth.com/javascript-filter-boolean/
      let currentLevel = tree; // tree not true please read properly future me 😭

      parts.forEach((part, index) => { // looping over each part of the url like the part pages index = 0
        if (!currentLevel[part]) {
          currentLevel[part] = {
            __data: null, // theres a real folder called data and good reckons this is how the cool kids avoid names conflicting even if it looks straight hideous and reminds me of python
            __children: {}
          };
        }

        if (index === parts.length - 1) { // checks if at the last part of the url and attaches the page object to __data so we can access url and title later.
          currentLevel[part].__data = page;
        }
        currentLevel = currentLevel[part].__children;
      });
    });

    return tree;
  });

  function dateFromFilename(inputPath) {
    const filename = inputPath.split("/").pop().replace(".md", "");
    const [y, m, d] = filename.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  eleventyConfig.addCollection("calendarData", (collectionApi) => {
    const items = collectionApi.getFilteredByGlob(
      "src/pages/ramblings/data_files/*.md"
    );
    const calendar = {};

    for (let item of items) {
      const { data, url, inputPath } = item;
      const date = dateFromFilename(inputPath);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const title = data.title || "Untitled entry";

      calendar[year] ??= {};
      calendar[year][month] ??= {};
      calendar[year][month][day] = { url, title };

      item.data.date = date;
    }

    const months = Object.entries(calendar).flatMap(([year, monthsObj]) =>
      Object.entries(monthsObj).map(([month, days]) => {
        const yearNum = +year;
        const monthNum = +month;
        const firstDay = new Date(yearNum, monthNum - 1, 1);
        return {
          year: yearNum,
          month: monthNum,
          days,
          firstDayOfWeek: firstDay.getDay() + 1,
          daysInMonth: new Date(yearNum, monthNum, 0).getDate(),
        };
      })
    );

    return months.sort((a, b) => a.year - b.year || a.month - b.month);
  });

  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      if (this.page.inputPath.includes("src/pages/misc/")) {
        return content;
      }
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      });
      return minified;
    }
    // if not an html output, return content as-is
    return content;
  });

  // had to add a filter bc im dumb or something and couldnt figure out how to deal with files being passed through
  eleventyConfig.addFilter("cssmin", function (code) {
    return new cleanCss({}).minify(code).styles;
  });

	eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItFootnote);
    mdLib.use(markdownItKatex);
    mdLib.use(markdownItTaskList, { enabled: true });
  });
	eleventyConfig.addPlugin(pluginRss);
  
  eleventyConfig.setQuietMode(true);

  eleventyConfig.on("afterBuild", () => {
    const inputPath = "src/_data/thoughts.json";
    const outputPath = "_site/_data/thoughts.min.json";
    const raw = fs.readFileSync(inputPath, "utf-8");
    const data = JSON.parse(raw);
    const removeFields = ["description", "score", "image", "imageB", "dateModified"];

    const cleaned = data.map(entry => {
      const newEntry = { ...entry };
      removeFields.forEach(f => delete newEntry[f]);
      return newEntry;
    });

    fs.writeFileSync(outputPath, JSON.stringify(cleaned));
    console.log("✅ Build completed successfully!");
  });

  let setPathPrefix = "/";

  if (buildTarget === "github") {
    setPathPrefix = "/moosyu.github.io";
    siteUrl = "https://moosyu.github.io/";
  }

  if (buildTarget === "nekoweb") {
    setPathPrefix = "/";
    siteUrl = "https://moosyu.nekoweb.org";
  }

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: setPathPrefix
  };
};