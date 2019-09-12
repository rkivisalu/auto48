import CarMeta from './CarMeta';
import CommentContainer from './CommentContainer';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import marked from 'marked';
import { CAR_PAGE_LOADED, CAR_PAGE_UNLOADED } from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.car,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: CAR_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: CAR_PAGE_UNLOADED })
});

class Car extends React.Component {
  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Cars.get(this.props.match.params.id),
      agent.Comments.forCar(this.props.match.params.id)
    ]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.car) {
      return null;
    }

    const markup = { __html: marked(this.props.car.body, { sanitize: true }) };
    const canModify = this.props.currentUser &&
      this.props.currentUser.username === this.props.car.author.username;
    return (
      <div className="car-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.car.title}</h1>
            <CarMeta
              car={this.props.car}
              canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row car-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {
                  this.props.car.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="car-actions">
          </div>

          <div className="row">
            <CommentContainer
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              slug={this.props.match.params.id}
              currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Car);
