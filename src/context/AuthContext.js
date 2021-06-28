import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const signUp = (email, password) => {
       return auth.createUserWithEmailAndPassword(email, password)
    }

    const logIn = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const logOut = () => auth.signOut()

    const resetPassword = (email) => auth.sendPasswordResetEmail(email)

    const updateEmail = (email) => currentUser.updateEmail(email)

    const updatePassword = (password) => currentUser.updatePassword(password)
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signUp,
        logIn,
        logOut,
        resetPassword,
        updateEmail,
        updatePassword,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
