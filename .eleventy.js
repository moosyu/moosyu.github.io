const htmlmin = require("html-minifier-terser");
const cleanCss = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownItKatex = require("@vscode/markdown-it-katex").default;
const markdownIt = require("markdown-it");
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("wordCount", (content) => {
    return content.replace(/(<([^>]+)>)/gi, "").split(/\s+/).length;
  });

  eleventyConfig.addFilter("readTime", (content) => {
    let wordCount = content ? content.replace(/(<([^>]+)>)/gi, "").split(/\s+/).length : 0;
    return Math.ceil(wordCount / 200);
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
    "src/pages/musicring/sitesMusicRing.json" : "sitesMusicRing.json"
  });
  eleventyConfig.addPassthroughCopy("src/_data/*");
  eleventyConfig.addPassthroughCopy("src/css/*");
  eleventyConfig.addPassthroughCopy("src/js/*");
  eleventyConfig.setServerOptions({
    liveReload: true,
    port: 5501,
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

  eleventyConfig.addNunjucksFilter("format", function(value, format) {
    if (format === "%02d") {
      return value.toString().padStart(2, '0');
    }
    return value;
  });

  eleventyConfig.addNunjucksFilter("convertNumMonth", function(value) {
    return monthNames[value - 1];
  });

  eleventyConfig.addCollection("calendarData", function (collectionApi) {
    let calendar = {};
    let items = collectionApi.getFilteredByGlob("src/pages/ramblings/data_files/*.md");

    for (let item of items) {
      let d = item.date;
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();

      calendar[year] ??= {};
      calendar[year][month] ??= {};
      calendar[year][month][day] = item.url;
    }

    let months = [];
    for (let year of Object.keys(calendar)) {
      for (let month of Object.keys(calendar[year])) {
        const yearNum = Number(year);
        const monthNum = Number(month);
        const firstDay = new Date(yearNum, monthNum - 1, 1);
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

        months.push({
          year: yearNum,
          month: monthNum,
          days: calendar[year][month],
          firstDayOfWeek: firstDay.getDay() + 1,
          daysInMonth: daysInMonth
        });
      }
    }

    months.sort((a, b) => a.year - b.year || a.month - b.month);
    return months;
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
  const md = markdownIt({
    html: true,
    linkify: true,
  }).use(markdownItKatex);
  eleventyConfig.setLibrary("md", md);
	eleventyConfig.addPlugin(pluginRss);

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: "/"
  };
};