import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { CAR_FAVORITED, CAR_UNFAVORITED } from '../constants/actionTypes';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
  favorite: slug => dispatch({
    type: CAR_FAVORITED,
    payload: agent.Cars.favorite(slug)
  }),
  unfavorite: slug => dispatch({
    type: CAR_UNFAVORITED,
    payload: agent.Cars.unfavorite(slug)
  })
});

const CarPreview = props => {
  const car = props.car;
  const favoriteButtonClass = car.favorited ?
    FAVORITED_CLASS :
    NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (car.favorited) {
      props.unfavorite(car.slug);
    } else {
      props.favorite(car.slug);
    }
  };

  return (
    <div className="car-preview">
      <div className="car-meta">
        <Link to={`/@${car.author.username}`}>
          <img src={car.author.image} alt={car.author.username} />
        </Link>

        <div className="info">
          <Link className="author" to={`/@${car.author.username}`}>
            {car.author.username}
          </Link>
          <span className="date">
            {new Date(car.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass} onClick={handleClick}>
            <i className="ion-heart"></i> {car.favoritesCount}
          </button>
        </div>
      </div>

      <Link to={`/car/${car.slug}`} className="preview-link">
        <h1>{car.title}</h1>
        <p>{car.description}</p>
        <p>{car.kw}</p>
        <p>{car.price}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {
            car.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              )
            })
          }
        </ul>
      </Link>
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(CarPreview);
