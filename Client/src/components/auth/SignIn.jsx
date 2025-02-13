import { auth, googleProvider } from ""
import { signInWithPopup } from "firebase/auth";

const SignIn = () => {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in successfully!");
        } catch (error) {
            console.error("Error signing in: ", error.message);
        }
    };

    return (
        <button className="sign-in" onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    );
};

export default SignIn;
