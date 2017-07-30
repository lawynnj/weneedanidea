import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { loginRequest } from './actions'
import { firebaseApp } from '../../firebase';
import './indexLogin.css';

class Login extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){
    firebaseApp.auth().onAuthStateChanged( user => {
      if (user) {
        this.props.history.replace('/');
      }
    });
  }

  componentDidMount() {
    // reset error state for when user goes back (erases the error messages)
    this.props.loginRequest("resetState");
  }

  //Returns a component for a Field
  renderField(field) {
    const { meta: {touched, error} } = field;
    // If field was touched and user input isn't satisfied, add has-danger to class
    const className = `text-help ${touched && error ? 'has-danger' : ''}`
    return (
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-addon" id="sizing-addon1"><i className={field.inputClassName}></i></span>
          <input
            type={field.inputType}
            className="form-control"
            placeholder={field.label}
            aria-describedby="sizing-addon1"
            {...field.input}
          />
        </div>
        <div className={className}>
          {touched ? error  : ''}
        </div>
      </div>

    );
  }

  // Handles submitting of form
  onSubmit(values){

    // Try to log in with given username and password
    this.props.loginRequest(values, () => {
      //redirect to user's homepage
      this.props.history.push('/');
    });

  }
  render() {
    const { handleSubmit } = this.props;
    return(
      <div className="row" id="login">
        <div className="col-md-8 col-md-offset-2 col-lg-8">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title"><strong>Sign In </strong></h3>
            </div>

            <div className="panel-body col-md-offset-2">
              <form className="form-horizontal col-md-8" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field
                  label="E-mail"
                  inputType="text"
                  name="username"
                  inputClassName="glyphicon glyphicon-user"
                  component={this.renderField}>
                </Field>
                <Field
                  label="Password"
                  inputType="password"
                  name="password"
                  inputClassName="glyphicon glyphicon-lock"
                  component={this.renderField}>
                </Field>
                <div className="text-help">{this.props.status.error === true ? this.props.status.message : ''}</div>
                <div className="btn-toolbar">
                    <button type="submit" className="btn button raised" style={{backgroundColor: '#3f51b5', color: 'white'}} >Login</button>
                    <button className="btn button raised" style={{backgroundColor: '#ec407a'}}><Link to="/register" style={{ color: 'white'}}>Register</Link></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Called when form is submitted, to ensure form values are correct
// Params: values => contains the fields from the form
// Return: {} that contains errors
function validate(values) {

  const errors = {};
  // Are username and password empty?
  if(!values.username || values.username.length === 0) {
    errors.username = "Enter a username!";
  }
  if(!values.password || values.password.length === 0) {
    console.log('abc');
    errors.password = "Enter a password!";
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    status: state.loginStatus
  }
}

export default withRouter(reduxForm({
  validate,
  form: 'LoginForm' // Must be unique from other forms in Application
})(
  connect(mapStateToProps, { loginRequest })(Login)
));
