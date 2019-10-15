var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var CarSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  body: String,
  kw: String,
  price: String,
  favoritesCount: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

CarSchema.plugin(uniqueValidator, {message: 'is already taken'});

CarSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }

  next();
});

CarSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

CarSchema.methods.updateFavoriteCount = function() {
  var car = this;

  return User.count({favorites: {$in: [car._id]}}).then(function(count){
    car.favoritesCount = count;

    return car.save();
  });
};

CarSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    kw: this.kw,
    price: this.price,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Car', CarSchema);
