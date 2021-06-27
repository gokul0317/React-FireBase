import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Login() {
    const history = useHistory()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { logIn } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const hadleSubmit = async (e) => {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        try {
           setError('')
           setLoading(true)
           await logIn(email, password)
           history.push('/')
        } catch (e) {
            console.log(e)
            return setError(`Failed to Login user`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
          <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
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
                    <Button type="submit" disabled={loading} className="w-100">Login</Button>
                    <div className="w-100 text-center mt-3">
                        <Link to='/forgot-password'>Forgot Password?</Link>
                    </div>
                </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
              Create an account? <Link to='/signup'>Sign Up</Link>
          </div>
        </>
    )
}
