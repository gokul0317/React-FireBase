import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const [error, setError] = useState('')
    const history = useHistory()
    const { currentUser, logOut } = useAuth()

    const logout = async () => {
        setError('')
        try {
            await logOut()
            history.push('/signin')
        } catch(e) {
         setError('Failed to logout')
        }
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong>{currentUser?.email}
                    <Link to='/update-profile' className="btn btn-primary w-100 mt-2">Update Profile</Link>

                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={logout}>Logout</Button>
            </div>
        </>
    )
}
