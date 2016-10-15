import React, {Component, PropTypes} from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import PollIcon from 'material-ui/svg-icons/social/poll'


class SpeedDialItem extends Component {
    get styles() {
        let delay = this.props.delay + "ms"

        return {
            tooltip: {
                position: 'absolute',
                right: 48,
                top: 8,
                background: 'rgba(70,70,70,.9)',
                borderRadius: 2,
                boxShadow: '0 1px 2px rgba(0,0,0,.15)',
                color: '#ececec',
                display: 'inline-block',
                fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize: 13,
                fontWeight: 'bold',
                lineHeight: '1em',
                padding: '6px 8px',
                textOverflow: 'ellipsis',
                verticalAlign: 'middle',
                minWidth: 60,
                maxWidth: 200,
                overflow: 'hidden',
                transitionDelay: delay,
                opacity: this.props.open ? 0.6 : 0
            },
            action: {
                position: 'relative',
                marginBottom: 15,
            },
            btn: {
                transition: 'transform 0.2s ease-in-out',
                transitionDelay: this.props.delay + 'ms',
                transform: !this.props.open ? 'scale(0, 0)' : null
            }
        }
    }

    render() {
        return (
            <div style={this.styles.action} onTouchTap={this.props.handler} >
              <div style={this.styles.tooltip}  >
                <div>{this.props.tooltip}</div>
              </div>
              <div style={this.styles.btn}>
                <FloatingActionButton backgroundColor={this.props.backColor} iconStyle={{fill: this.props.fillColor}}  mini={true}>
                    {this.props.icon}
                </FloatingActionButton>
              </div>
            </div>
        )
    }
}

SpeedDialItem.defaultProps = {
    fillColor: 'white',
    backColor: '#3c80f6'
}


SpeedDialItem.propTypes = {
    fillColor: React.PropTypes.string,
    backColor: React.PropTypes.string,
}


class SpeedDial extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }

    this._timeout = null
    this._locked = false
  }

  get styles() {
      return {
          container: {
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 56,
              textAlign: 'center',
              zIndex: 1110
          },
          actions: {
              position: 'absolute',
              right: 8,
              transition: !this.state.open ? 'top 0s linear 0.2s' : null,
              top: this.state.open ? React.Children.count(this.props.children) * -56 : 100
          },
          cover: {
            position: 'fixed',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 1100,
            transition: this.state.open ? 'opacity 0.2s ease-in-out' : 'opacity 0.2s ease-in-out, height 0s linear 0.2s',
            opacity: this.state.open ? 1 : 0,
            background: '#5dc1b2',
            background: '-moz-linear-gradient(-45deg, #5dc1b2 0%, #1fbcd2 100%)',
            background: '-webkit-linear-gradient(-45deg, #5dc1b2 0%, #1fbcd2 100%)',
            background: 'linear-gradient(135deg, #5dc1b2 0%, #1fbcd2 100%)',
          }
      }
  }

  shouldComponentUpdate(nextProps, nextState) {
      return nextState.open !== this.state.open
  }

  _clearTimeout() {
      if (this._timeout) {
          clearTimeout(this._timeout)
      }
  }

  _toggle(open) {
      this.setState({open: open})
  }

  handleOn() {
      if (this._locked) return
      this._clearTimeout()
      this._toggle(true)
  }

  handleOff(force) {
      this._clearTimeout()

      if (force) {
          this._locked = true
          setTimeout(() => this._locked = false, 200)
          this._toggle(false)
          return
      }

      this._timeout = setTimeout(() => this._toggle(false), 100);
  }

  render() {
    return (
      <div onMouseOver={this.handleOn.bind(this)} onMouseOut={this.handleOff.bind(this, false)}>
        <div style={this.styles.cover} onTouchTap={this.handleOff.bind(this, true)} />
        <div style={this.styles.container}>
          <div onClick={this.handleOff.bind(this, true)} style={this.styles.actions}>
            {
                React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
                    delay: 30 * (React.Children.count(this.props.chidren) - index),
                    open: this.state.open
                }))
            }
          </div>
          <FloatingActionButton style={{transform: (this.state.open ? 'rotate(360deg)' : null)}}>
                {this.state.open ? <PollIcon /> : <ContentAdd />}
          </FloatingActionButton>
        </div>
      </div>
    )
  }
}

export { SpeedDial, SpeedDialItem }
