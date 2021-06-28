import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import CenteredContainer from '../CenteredContainer'

import { useAuth } from '../../context/AuthContext'
export default function ForgotPassword() {
    const history = useHistory()
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const hadleSubmit = async (e) => {
        e.preventDefault()
        const email = emailRef.current.value
        try {
           setError('')
           setLoading(true)
           await resetPassword(email)
           history.push('/signin')
        } catch (e) {
            console.log(e)
            return setError(`Failed to send password reset link`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <CenteredContainer>
          <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={hadleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required></Form.Control>
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">Reset Password</Button>
                    <div className="w-100 text-center mt-3">
                        <Link to='/signin'>Login?</Link>
                    </div>
                </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
              Create an account? <Link to='/signup'>Sign Up</Link>
          </div>
        </CenteredContainer>
    )
}
