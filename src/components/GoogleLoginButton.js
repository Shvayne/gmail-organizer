import { Box, Button } from "@chakra-ui/react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ profile, setUser, setProfile }) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
        // console.log('user', codeResponse)
        setUser(codeResponse)
    },
    onError: (error) => console.log("Login failed", error),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    prompt: 'consent',
  });

  const logout = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <Box textAlign="center">
      {profile ? (
        <Button onClick={logout}>Sign Out</Button>
      ) : (
        <Button onClick={login}>Sign in with Google</Button>
      )}
    </Box>
  );
};

export default GoogleLoginButton;
