import { connect } from 'react-redux'
import superagent from 'superagent'
import SignupView from './SignupView'
import { appType } from 'lib/util'

const url = window.REACT_APP_APP_TYPE ? `${window.location.hostname}:3030`
  : process.env.REACT_APP_NODE_ENV === 'test' ? process.env[`REACT_APP_${appType.toUpperCase()}_LOCAL_API_TEST_URL`]
  : appType === 'broker' ? process.env.REACT_APP_BROKER_LOCAL_API_URL || 'https://aboveboard-broker-api.herokuapp.com/'
  : appType === 'direct' ? process.env.REACT_APP_DIRECT_LOCAL_API_URL || 'https://aboveboard-direct-api.herokuapp.com/'
  : process.env.REACT_APP_ISSUER_LOCAL_API_URL || 'https://aboveboard-issuer-api.herokuapp.com/'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
  return {
    changeCaptchaImage: () =>
      superagent
        .get(`${url}captcha.png`)
        .then(res => res.body)
        .catch(error => {
          dispatch({
            type: 'CHANGE_CAPTCHA_IMAGE_ERROR',
            error
          })
        })
    ,
    signup: data =>
    console.log('sigjn up data ', data) || 
      superagent
        .post(`${url}sign-up`)
        .send(data)
        .then(res => {
          console.log('res ', res)
        })
        .catch(error => {
          console.log('dispatching ', error)
          dispatch({
            type: 'SIGNUP_ERROR',
            error
          })
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupView)
