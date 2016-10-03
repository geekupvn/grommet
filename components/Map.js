'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _CSSClassnames = require('../utils/CSSClassnames');

var _CSSClassnames2 = _interopRequireDefault(_CSSClassnames);

var _Intl = require('../utils/Intl');

var _Intl2 = _interopRequireDefault(_Intl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

var CLASS_ROOT = _CSSClassnames2.default.MAP;

var ResourceMap = function (_Component) {
  (0, _inherits3.default)(ResourceMap, _Component);

  function ResourceMap(props, context) {
    (0, _classCallCheck3.default)(this, ResourceMap);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ResourceMap.__proto__ || (0, _getPrototypeOf2.default)(ResourceMap)).call(this, props, context));

    _this._onResize = _this._onResize.bind(_this);
    _this._layout = _this._layout.bind(_this);
    _this._draw = _this._draw.bind(_this);
    _this._onEnter = _this._onEnter.bind(_this);
    _this._onLeave = _this._onLeave.bind(_this);
    _this._getChildren = _this._getChildren.bind(_this);
    _this._getParent = _this._getParent.bind(_this);
    _this._mapNode = _this._mapNode.bind(_this);

    _this.state = { canvasHeight: 100, canvasWidth: 100 };
    return _this;
  }

  (0, _createClass3.default)(ResourceMap, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('resize', this._onResize);
      this._layout();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._layout();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._onResize);
    }
  }, {
    key: '_coords',
    value: function _coords(id, canvasRect) {
      var element = document.getElementById(id);
      var rect = element.getBoundingClientRect();
      var left = rect.left - canvasRect.left;
      var top = rect.top - canvasRect.top;
      var midX = left + rect.width / 2;
      var midY = top + rect.height / 2;
      return {
        top: [midX, top],
        bottom: [midX, top + rect.height],
        left: [left, midY],
        right: [left + rect.width, midY]
      };
    }
  }, {
    key: '_draw',
    value: function _draw() {
      var _this2 = this;

      var vertical = this.props.vertical;
      var dark = this.context.dark;

      var canvasElement = this.canvasRef;
      var highlightCanvasElement = this.highlightRef;
      // don't draw if we don't have a canvas to draw on, such as a unit test
      if (canvasElement.getContext) {
        (function () {
          var baseContext = canvasElement.getContext('2d');
          var highlightContext = highlightCanvasElement.getContext('2d');
          var canvasRect = canvasElement.getBoundingClientRect();
          baseContext.clearRect(0, 0, canvasRect.width, canvasRect.height);
          highlightContext.clearRect(0, 0, canvasRect.width, canvasRect.height);

          baseContext.strokeStyle = dark ? '#ffffff' : '#000000';
          baseContext.lineWidth = 1;
          highlightContext.strokeStyle = dark ? '#ffffff' : '#000000';
          highlightContext.lineWidth = 2;

          _this2.props.data.links.forEach(function (link) {
            var parentCoords = _this2._coords(link.parentId, canvasRect);
            var childCoords = _this2._coords(link.childId, canvasRect);
            var context = _this2.state.activeId === link.parentId || _this2.state.activeId === link.childId ? highlightContext : baseContext;

            context.beginPath();
            var p1 = void 0,
                p2 = void 0;
            if (vertical) {
              if (parentCoords.right[0] < childCoords.left[0]) {
                p1 = parentCoords.right;
                p2 = childCoords.left;
              } else {
                p1 = parentCoords.left;
                p2 = childCoords.right;
              }
            } else {
              if (parentCoords.bottom[1] < childCoords.top[1]) {
                p1 = parentCoords.bottom;
                p2 = childCoords.top;
              } else {
                p1 = parentCoords.top;
                p2 = childCoords.bottom;
              }
            }
            context.moveTo(p1[0], p1[1]);
            var midX = p1[0] + (p2[0] - p1[0]) / 2;
            var midY = p1[1] + (p2[1] - p1[1]) / 2;
            if (vertical) {
              context.quadraticCurveTo(midX + (p1[0] - midX) / 2, p1[1], midX, midY);
              context.quadraticCurveTo(midX - (p1[0] - midX) / 2, p2[1], p2[0], p2[1]);
            } else {
              context.quadraticCurveTo(p1[0], midY + (p1[1] - midY) / 2, midX, midY);
              context.quadraticCurveTo(p2[0], midY - (p1[1] - midY) / 2, p2[0], p2[1]);
            }
            context.stroke();
          });
        })();
      }
    }
  }, {
    key: '_layout',
    value: function _layout() {
      var mapElement = this.mapRef;
      if (mapElement) {
        if (mapElement.scrollWidth !== this.state.canvasWidth || mapElement.scrollHeight !== this.state.canvasHeight) {
          this.setState({
            canvasWidth: mapElement.scrollWidth,
            canvasHeight: mapElement.scrollHeight
          });
        }
        clearTimeout(this._drawTimer);
        this._drawTimer = setTimeout(this._draw, 50);
      }
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      // debounce
      clearTimeout(this._layoutTimer);
      this._layoutTimer = setTimeout(this._layout, 50);
    }
  }, {
    key: '_onEnter',
    value: function _onEnter(id) {
      this.setState({ activeId: id });
    }
  }, {
    key: '_onLeave',
    value: function _onLeave() {
      this.setState({ activeId: undefined });
    }
  }, {
    key: '_getChildren',
    value: function _getChildren(parentId) {
      var data = this.props.data;

      var children = [];
      data.links.forEach(function (link) {
        if (link.parentId === parentId) {
          children.push(link.childId);
        }
      });
      if (children.length > 0) {
        return this._mapNode(children);
      } else {
        return undefined;
      }
    }
  }, {
    key: '_getParent',
    value: function _getParent(childId) {
      var data = this.props.data;

      var parent = [];
      data.links.forEach(function (link) {
        if (link.childId === childId) {
          parent.push(link.parentId);
        }
      });
      if (parent.length > 0) {
        return this._mapNode(parent);
      } else {
        return undefined;
      }
    }
  }, {
    key: '_mapNode',
    value: function _mapNode(elements) {
      var data = this.props.data;

      return elements.map(function (element) {
        var node = void 0;
        data.categories.some(function (category) {
          return category.items.some(function (item) {
            if (item.id === element) {
              node = item.node;
              return true;
            }
          });
        });
        return node;
      });
    }
  }, {
    key: '_renderItems',
    value: function _renderItems(items) {
      var _this3 = this;

      var data = this.props.data;
      var activeId = this.state.activeId;
      var intl = this.context.intl;

      return items.map(function (item, index) {
        var active = activeId === item.id || data.links.some(function (link) {
          return (link.parentId === item.id || link.childId === item.id) && (link.parentId === activeId || link.childId === activeId);
        });
        var classes = (0, _classnames4.default)(CLASS_ROOT + '__item', (0, _defineProperty3.default)({}, CLASS_ROOT + '__item--active', active));
        var children = _this3._getChildren(item.id);
        var parent = _this3._getParent(item.id);

        var relationshipMessage = '';
        if (!children && !parent) {
          relationshipMessage = _Intl2.default.getMessage(intl, 'No Relationship');
        } else {
          if (parent) {
            var parentMessage = _Intl2.default.getMessage(intl, 'Parent');
            relationshipMessage += ', ' + parentMessage + ': (' + parent.join() + ')';
          }
          if (children) {
            var childrenMessage = _Intl2.default.getMessage(intl, 'Children');
            relationshipMessage += ', ' + childrenMessage + ': (' + children.join() + ')';
          }
        }
        return _react2.default.createElement(
          'li',
          { key: index, id: item.id, className: classes,
            role: 'text', 'aria-label': item.node + ' ' + relationshipMessage,
            onMouseEnter: _this3._onEnter.bind(_this3, item.id),
            onMouseLeave: _this3._onLeave.bind(_this3, item.id) },
          item.node
        );
      });
    }
  }, {
    key: '_renderCategories',
    value: function _renderCategories(categories) {
      var _this4 = this;

      return categories.map(function (category) {
        return _react2.default.createElement(
          'li',
          { key: category.id, className: CLASS_ROOT + '__category' },
          _react2.default.createElement(
            'div',
            { className: CLASS_ROOT + '__category-label' },
            category.label
          ),
          _react2.default.createElement(
            'ul',
            { className: CLASS_ROOT + '__category-items' },
            _this4._renderItems(category.items)
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props;
      var className = _props.className;
      var data = _props.data;
      var vertical = _props.vertical;
      var props = (0, _objectWithoutProperties3.default)(_props, ['className', 'data', 'vertical']);
      var _state = this.state;
      var canvasHeight = _state.canvasHeight;
      var canvasWidth = _state.canvasWidth;

      var classes = (0, _classnames4.default)(CLASS_ROOT, (0, _defineProperty3.default)({}, CLASS_ROOT + '--vertical', vertical), className);

      var categories = void 0;
      if (data.categories) {
        categories = this._renderCategories(data.categories);
      }

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({ ref: function ref(_ref3) {
            return _this5.mapRef = _ref3;
          } }, props, { className: classes }),
        _react2.default.createElement('canvas', { ref: function ref(_ref) {
            return _this5.canvasRef = _ref;
          }, width: canvasWidth,
          height: canvasHeight, className: CLASS_ROOT + '__canvas' }),
        _react2.default.createElement('canvas', { ref: function ref(_ref2) {
            return _this5.highlightRef = _ref2;
          },
          className: CLASS_ROOT + '__canvas ' + CLASS_ROOT + '__canvas--highlight',
          width: canvasWidth, height: canvasHeight }),
        _react2.default.createElement(
          'ol',
          { className: CLASS_ROOT + '__categories' },
          categories
        )
      );
    }
  }]);
  return ResourceMap;
}(_react.Component);

ResourceMap.displayName = 'ResourceMap';
exports.default = ResourceMap;


ResourceMap.contextTypes = {
  dark: _react.PropTypes.bool,
  intl: _react.PropTypes.object
};

ResourceMap.propTypes = {
  data: _react.PropTypes.shape({
    categories: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      id: _react.PropTypes.string,
      label: _react.PropTypes.node,
      items: _react.PropTypes.arrayOf(_react.PropTypes.shape({
        id: _react.PropTypes.string,
        node: _react.PropTypes.node
      }))
    })),
    links: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      parentId: _react.PropTypes.string,
      childId: _react.PropTypes.string
    }))
  }).isRequired,
  vertical: _react.PropTypes.bool
};
module.exports = exports['default'];