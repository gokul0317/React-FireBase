import React, { useContext, useState, useEffect } from 'react'
import FirebaseAuth from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const signUp = (email, password) => {
       return FirebaseAuth.auth.createUserWithEmailAndPassword(email, password)
    }

    const logIn = (email, password) => {
        return FirebaseAuth.auth.signInWithEmailAndPassword(email, password)
    }

    const logOut = () => FirebaseAuth.auth.signOut()

    const resetPassword = (email) => FirebaseAuth.auth.sendPasswordResetEmail(email)

    const updateEmail = (email) => currentUser.updateEmail(email)

    const updatePassword = (password) => currentUser.updatePassword(password)
    
    useEffect(() => {
        const unsubscribe = FirebaseAuth.auth.onAuthStateChanged(user => {
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
