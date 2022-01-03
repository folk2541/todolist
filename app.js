const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://folk2541:019968078@cluster0.bn4cc.mongodb.net/Todolist?retryWrites=true&w=majority"
);
const app = express();
const listSchema = new mongoose.Schema({
  Topic: String,
  items: Array,
});
const List = mongoose.model("List", listSchema);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  List.findOne({ Topic: "Home" }, function (err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {
      const Itemlist = new List({
        Topic: "Home",
        items: [],
      });
      Itemlist.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.render("index", { workTitle: "Home", workItems: result.items });
    }
  });
});
app.get("/:workTopic", function (req, res) {
  const workTopic = req.params.workTopic;
  List.findOne({ Topic: workTopic }, function (err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {
      const Itemlist = new List({
        Topic: workTopic,
        items: [],
      });
      Itemlist.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/" + workTopic);
        }
      });
    } else {
      res.render("index", { workTitle: workTopic, workItems: result.items });
    }
  });
});

app.post("/", function (req, res) {
  const workTitle = req.body.workTitle;
  const item = req.body.listItem;
  List.findOneAndUpdate(
    { Topic: workTitle },
    { $push: { items: item } },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/" + workTitle);
      }
    }
  );
});
app.post("/delete", function (req, res) {
  const workTopicDelete = req.body.workTopicDelete;
  const workListDelete = req.body.workListDelete;
  List.findOneAndUpdate(
    { Topic: workTopicDelete },
    { $pull: { items: workListDelete } },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (workTopicDelete === "Home") {
          res.redirect("/");
        } else {
          res.redirect("/" + workTopicDelete);
        }
      }
    }
  );
});

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8000;
// }
// app.listen(port);

app.listen(3000);
