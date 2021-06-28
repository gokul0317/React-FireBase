import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CenteredContainer from '../CenteredContainer'

import { useAuth } from '../../context/AuthContext'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signUp } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const hadleSubmit = async (e) => {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        const confirmPassword = passwordConfirmRef.current.value
        if (password !== confirmPassword) {
            return setError(`Password Doesn't Match`)
        }
        try {
           setError('')
           setLoading(true)
           await signUp(email, password)
        } catch (e) {
            console.log(e)
            return setError(`Failed to create user`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <CenteredContainer>
          <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={hadleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required></Form.Control>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required></Form.Control>
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required></Form.Control>
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">Sign Up</Button>
                </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
              Already have an account? <Link to='/signin'>Login</Link> 
          </div>
        </CenteredContainer>
    )
}
