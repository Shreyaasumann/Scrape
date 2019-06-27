var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var Note = require("./models/Note");
var Article = require("./models/Article");


var PORT = process.env.PORT || 3000;

var app = express();


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {
  
  axios.get("https://www.nytimes.com/section/business", function(error, response, html) {
    
    var $ = cheerio.load(html);

    $("h2").each(function(i, element) {

      var result = {};

    
    $("div.story-body").each(function(i, element) {
        var link = $(element).find("a").attr("href");
		var title = $(element).find("h2.headline").text().trim();
		var summary = $(element).find("p.summary").text().trim();
		var img = $(element).parent().find("figure.media").find("img").attr("src");
		result.link = link;
		result.title = title;
		if (summary) {
				result.summary = summary;
		};
		if (img) {
				result.img = img;
		}
		else {
				result.img = $(element).find(".wide-thumb").find("img").attr("src");
		};
		var entry = new Article(result);
		Article.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
		});
		console.log("Scrape finished.");
		res.redirect("/");
	});
});

      
      var result = {};

      
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      
      db.Article.create(result)
        .then(function(dbArticle) {
          
          console.log(dbArticle);
        })
        .catch(function(err) {
          
          console.log(err);
        });
    });

   
    res.send("Scrape Complete!");
  });
});


app.get("/articles", function(req, res) {
  
    db.Article.find()
      
      .then(function(dbPopulate) {
        
        res.json(dbPopulate);
      })
      .catch(function(err) {
       
        res.json(err);
      });
});


app.get("/articles/:id", function(req, res) {
  
  db.Article.findOne({_id: req.params.id)
  .populate("note")
  .then(function(dbPopulate) {
    
    res.json(date);
  })
  .catch(function(err) {
    
    res.json(err);
  });
});


app.post("/search", function(req, res) {
  
    console.log(req.body.search);
	Article.find({$text: {$search: req.body.search, $caseSensitive: false}}, null, {sort: {created: -1}}, function(err, data) {
		console.log(data);
		if (data.length === 0) {
			res.render("placeholder", {message: "Nothing has been found. Please try other keywords."});
		}
		else {
			res.render("search", {search: data})
		}
    })
    
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
