import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const email = user.email;

                if (email.endsWith('@bigapplerecsports.com')) {
                    setCurrentUser(user);
                } else {
                    console.error('Unauthorized email domain.');
                    signOut(auth);
                }
            })
            .catch((error) => {
                console.error('Error during sign-in:', error);
            });
    };

    const logout = () => {
        signOut(auth)
            .then(() => {
                setCurrentUser(null);
            })
            .catch((error) => {
                console.error('Error during sign-out:', error);
            });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user?.email.endsWith('@bigapplerecsports.com')) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signInWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
