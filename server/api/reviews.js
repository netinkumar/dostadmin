var Review = require('../models/review');
//var Subscribe = require('../models/subscribe');
// Users API
var User = require('../models/user');
module.exports = function (apiRouter) {

  apiRouter.post('/review/add', function (req, res) {
    if (!req.body.userid) {
      res.json({ 'status': false, 'message': 'User must be logged in.' });
    } else {
      var review = new Review();
      review.userid = req.body.userid;
      review.vendorid = req.body.vendorid;
      review.rating = req.body.rating;
      review.description = req.body.description;
      review.save(function (err, review) {
        if (err) {
          res.send({ 'status': false, 'data': err });
        } else {
          res.send({ 'status': true, 'message': "Review has been posted successfully."});
        }
      });
    }
  });



    apiRouter.post('/review/view_reviews', function (req, res) {
    if (!req.body.vendorid) {
      res.json({ 'status': false, 'message': 'User must be logged in.' });
    } else {
     // var review = new Review();
      var id = req.body.vendorid;
      Review.find({'vendorid' : id},function (err, reviews) {
        var allreviews = [];
       
        if (err) {
          res.send({ 'status': false, 'data': err });
        } else {
          for (let i in reviews) {
           // console.log(reviews[i].userid)
            User.findById({ '_id': reviews[i].userid }, function (err, user) {
              console.log(user);
              allreviews.push({'review' : reviews[i], 'user' : user})
            })
          }
          setTimeout(function () {
            console.log(allreviews);
            console.log('boo');
            res.send({ 'status': true, 'data' : allreviews, });
          }, 2000)  // you can increase the time otherwise go for aggregate
        }
      });
    }
  });

};