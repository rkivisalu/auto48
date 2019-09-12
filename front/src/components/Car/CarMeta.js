import CarActions from './CarActions';
import { Link } from 'react-router-dom';
import React from 'react';

const CarMeta = props => {
  const car = props.car;
  return (
    <div className="car-meta">
      <Link to={`/@${car.author.username}`}>
        <img src={car.author.image} alt={car.author.username} />
      </Link>

      <div className="info">
        <Link to={`/@${car.author.username}`} className="author">
          {car.author.username}
        </Link>
        <span className="date">
          {new Date(car.createdAt).toDateString()}
        </span>
      </div>

      <CarActions canModify={props.canModify} car={car} />
    </div>
  );
};

export default CarMeta;
