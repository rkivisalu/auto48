import CarPreview from './CarPreview';
import ListPagination from './ListPagination';
import React from 'react';

const CarList = props => {
  if (!props.cars) {
    return (
      <div className="car-preview">Loading...</div>
    );
  }

  if (props.cars.length === 0) {
    return (
      <div className="car-preview">
        You don't have any cars for sale
      </div>
    );
  }

  return (
    <div>
      {
        props.cars.map(car => {
          return (
            <CarPreview car={car} key={car.slug} />
          );
        })
      }

      <ListPagination
        pager={props.pager}
        carsCount={props.carsCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default CarList;
