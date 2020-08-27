import React, { useEffect, useState } from 'react';                        // Import React
import { NavLink } from 'react-router-dom';       // Import NavLink for "navigation"

// Declare AuthForm functional component, receives action variable for conditional rendering,
// phone_number, password and confirm_password variables from form state variable, and submit and handleChange functions
const AuthForm = ( { submit, action, phone_number = '', password = '', confirm_password = '', handleChange, spinnerState } ) => {

  let error = null;
  const [ phoneInputState, setPhoneInputState ] = useState(null)
  const [ passwordInputState, setPasswordInputState ] = useState(null)
  const [ confPasswordInputState, setConfPasswordInputState ] = useState(null)
  const [ checkboxState, setCheckboxState ] = useState(false)
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true)
  const [ passwordValidationObj, setPasswordValidationObj ] = useState({minLength: false, oneCap: false, oneLow: false, oneNumber: false})

  useEffect( () => {
    if ( phoneInputState === 'uk-form-success' && passwordInputState === 'uk-form-success' && confPasswordInputState === 'uk-form-success' && checkboxState )
      setIsButtonDisabled(false);
    else
      setIsButtonDisabled(true);

    if ( spinnerState )
      setIsButtonDisabled(true);
  }, [phoneInputState, passwordInputState, confPasswordInputState, checkboxState, spinnerState])

  const validateEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
  }

  const validatePassword = (password) => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&-_/]{8,}$/;
    const regEXlowcase = /^(?=.*[a-z])/
    const regEXuppercase = /^(?=.*[A-Z])/
    const regEXnumber = /^(?=.*\d)/
    const regEXminlength = /[A-Za-z\d@$!%*?&-_/]{8,}$/
    setPasswordValidationObj( prevState => ({...prevState, oneLow: regEXlowcase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneCap: regEXuppercase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneNumber: regEXnumber.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, minLength: regEXminlength.test(password)}) )
    return regEx.test(password);
  }

  const inputValidation = (event) => {

    const { name, value } = event.target;

    handleChange(event);

    switch( name ) {
      case 'email': {
        if ( validateEmail(value) ) 
          setPhoneInputState('uk-form-success');
        else 
          setPhoneInputState('uk-form-danger');
        break;
      }
      case 'password': {
        if ( action === 'login' ) return null
        if (  validatePassword(value) )
          setPasswordInputState('uk-form-success');
        else
          setPasswordInputState('uk-form-danger');
        break;
      }
      case 'confirm_password': {
        if ( value === password )
          setConfPasswordInputState('uk-form-success')
        else
          setConfPasswordInputState('uk-form-danger')
      }
    }
    
  }

  return (
    <div className=" uk-width-1-1 uk-margin-top uk-margin-remove-top@s">

      <div className="uk-margin">

        <h2>{action === "signup" ? "Registro" : "Inicia Sesión"}</h2>
    
        { action === "signup" ? (
          <p>¿Ya tienes cuenta? 
            <NavLink to="/login" className="links uk-margin-small-left">
              Accede aquí
            </NavLink>
          </p>
          ) : (
          <p>¿No tienes cuenta? 
            <NavLink to="/registro" className="links uk-margin-small-left">
              Regístrate aquí
            </NavLink>
          </p>
          )
        }
      
      </div>

        <form className="uk-form-stacked" onSubmit={submit}>
          
          <div className="uk-margin">
            <label className="uk-form-label">Correo Electrónico:</label>
            <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
              <span className="uk-form-icon" uk-icon="icon: user"></span>
              <input onChange={event => inputValidation(event)} name="email" value={email} className={phoneInputState !== null ? `${emailInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"} type="email" required={true} />
            </div>
            { emailInputState === 'uk-form-danger' ?
                <div>
                  <span className="uk-text-danger">Introduce una dirección de correo válida</span>
                </div>
              : null 
            }
          </div>
          <div className="uk-margin">
            <label className="uk-form-label">Contraseña:</label>
            <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
              <span className="uk-form-icon" uk-icon="icon: lock"></span>
              <input
                onChange={event => inputValidation(event)}
                name="password"
                value={password}
                className={
                  action === 'signup' ?
                    passwordInputState !== null ? `${passwordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"
                  : "uk-input uk-width-1-1 uk-border-pill"}
                type="password"
                required={true}
              />
            </div>
            <div className="uk-margin uk-flex uk-flex-center">
                { action === 'signup' ?
                  <div className="uk-width-1-2@s uk-flex uk-flex-column">
                    <div className="uk-width-1-1 uk-flex">
                        { passwordValidationObj.oneCap ?
                          <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                            <span uk-icon="check" className="uk-width-1-6"></span> Una letra mayúscula
                          </div>
                          : 
                          <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                            <span uk-icon="warning" className="uk-width-1-6"></span>  Una letra mayúscula
                          </div>
                        }
                        { passwordValidationObj.oneNumber ?
                          <div className="uk-width-1-2 uk-flex uk-flex-middle uk-text-success">
                            <span uk-icon="check" className="uk-width-1-6"></span> Un número
                          </div>
                          : 
                          <div className="uk-width-1-2 uk-flex uk-flex-middle">
                            <span uk-icon="warning" className="uk-width-1-6"></span>  Un número
                          </div>
                        }
                        
                    </div>
                    <div className="uk-width-1-1 uk-flex">
                      { passwordValidationObj.oneLow ?
                        <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                          <span uk-icon="check" className="uk-width-1-6"></span> Una letra minúscula
                        </div>
                        : 
                        <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                          <span uk-icon="warning" className="uk-width-1-6"></span>  Una letra minúscula
                        </div>
                      }
                      { passwordValidationObj.minLength ?
                        <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle uk-text-success">
                          <span uk-icon="check" className="uk-width-1-6"></span> Mínimo 8 caracteres
                        </div>
                        : 
                        <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle">
                          <span uk-icon="warning" className="uk-width-1-6"></span> Mínimo 8 caracteres
                        </div>
                      }
                    </div>
                  </div>
                 : 
                  <NavLink to="/recuperar" className="links" onClick={event => setRoute('none')}>
                    ¿Olvidaste tu contraseña?
                  </NavLink>
                }
              </div>
            </div>
            { action === "signup" ? (
            <div className="uk-margin">
              <label className="uk-form-label">Confirma tu contraseña:</label>
              <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <input
                  onChange={event => inputValidation(event)}
                  name="confirm_password"
                  value={confirm_password}
                  className={passwordInputState !== null ? `${confPasswordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"}
                  type="password"
                />
              </div>
              { confPasswordInputState === 'uk-form-danger' ?
                  <div>
                    <span className="uk-text-danger">Asegúrate de introducir la misma contraseña</span>
                  </div>
                : null 
              }
            </div>
            ) : null
          }
            
            

          

          <button disabled={action === 'signup' ? isButtonDisabled : false} className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin" type="submit">
            {action === "signup" ? spinnerState ? "Registrando" : "Registrar" : "Entrar"} <div className={ spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
          </button>

        </form>
    </div>
  )

}

export default AuthForm;