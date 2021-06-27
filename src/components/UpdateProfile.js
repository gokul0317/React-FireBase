import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function UpdateProfile() {
    const history = useHistory()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updateEmail, updatePassword } = useAuth()
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
        const promises = []
        if (email !== currentUser.email) {
            promises.push(updateEmail(email))
        }
        if (password) {
            promises.push(updatePassword(password))
        }
        try {
           setError('')
           setLoading(true)
           await Promise.all(promises)
           history.push('/')
        } catch (e) {
            console.log(e)
            return setError(`Failed to create user`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
          <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Update Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={hadleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email} required></Form.Control>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep same"></Form.Control>
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep same"></Form.Control>
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">Update</Button>
                </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-3">
            <Link to='/'>Cancel</Link> 
          </div>
        </>
    )
}
