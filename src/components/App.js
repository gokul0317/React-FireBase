import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { AuthProvider } from '../context/AuthContext'
import Signup from './authentication/Signup'
import Login from './authentication/Login'
import Profile from './authentication/Profile'
import PrivateRoute from './authentication/PrivateRoute'
import ForgotPassword from './authentication/ForgotPassword'
import UpdateProfile from './authentication/UpdateProfile'
import Dashboard from './drive/Dashboard'
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute path='/' exact component={Dashboard} />
            <PrivateRoute path='/folder/:folderId' exact component={Dashboard} />
            
            <Route path='/user' component={Profile} />
            <Route path='/update-profile' component={UpdateProfile} />

            <Route path='/signup' component={Signup} />
            <Route path='/signin' component={Login} />
            <Route path='/forgot-password' component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
