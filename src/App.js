import "./App.css";
import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import GoogleLoginButton from "./components/GoogleLoginButton";
import axios from "axios";
import {
  getEmailsFromAllowedSenders,
  getEmailDetailsById,
} from "./services/gmailService";
import EmailOrganizer from "./components/EmailOrganizer";
import {
  getAllowedEmails,
  addAllowedEmail,
  removeAllowedEmail,
} from "./services/fileStorageService";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";

function App() {
  const [emails, setEmails] = useState([]);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [newAllowedEmail, setNewAllowedEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [profile, setProfile] = useState(null);
  // const [categories, setCategories] = useState([]);

  const bgColor = useColorModeValue("gray.50", "gray.900");

  /**
   * afterLogin - After a user logs in, this function fetches 
   * the allowed emails from storage and then 
   * retrieves emails from allowed senders.
   * It uses the Gmail API (getEmailsFromAllowedSenders) 
   * to get email message IDs and fetches email details
   * (getEmailDetailsById).
   */
  const afterLogin = async (user, googleId) => {
    const fetchedAllowedEmails = await getAllowedEmails(googleId);
    setAllowedEmails(fetchedAllowedEmails);

    setLoadingEmails(true);
    const messageIds = await getEmailsFromAllowedSenders(
      user.access_token,
      fetchedAllowedEmails
    );

    const emailDetailsPromises = messageIds.map(async (message) => {
      return await getEmailDetailsById(user.access_token, message.id);
    });

    const detailedEmails = await Promise.all(emailDetailsPromises);
    setEmails(detailedEmails.filter((email) => email));
    setLoadingEmails(false);
  };

  /**
   * This hook runs every time the user state changes.
   * It fetches the user profile from Google, sets the profile,
   * and calls afterLogin to initialize the app with allowed 
   * emails and Gmail data.
   * 
   */
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // console.log("profile", res);
          setProfile(res.data);
          afterLogin(user, res.data.id);
        })
        .catch((err) => console.error("Login failed:", err));
    }
  }, [user]);


  /**
   * handleAddAllowedEmail- This function adds a new email 
   * to the allowed list by calling addAllowedEmail,
   *  updates the state,  and refreshes the emails list.
   */
  const handleAddAllowedEmail = async () => {
    if (newAllowedEmail && !allowedEmails.includes(newAllowedEmail)) {
      const updatedAllowedEmails = await addAllowedEmail(
        profile.id,
        newAllowedEmail
      );
      setAllowedEmails(updatedAllowedEmails);
      afterLogin(user, profile.id);
      setNewAllowedEmail("");
    }
  };

  /**
   * handleRemoveAllowedEmail -  removes an email from the allowed list
   *  by calling removeAllowedEmail and refreshes the state.
   */

  const handleRemoveAllowedEmail = async (emailToRemove) => {
    const updatedAllowedEmails = await removeAllowedEmail(
      profile.id,
      emailToRemove
    );
    setAllowedEmails(updatedAllowedEmails);
    afterLogin(user, profile.id);
  };

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route
            path="/organizer"
            element={
              <Box p={4} bg={bgColor} minH="100vh" px={10}>
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  mb={16}
                >
                  <Heading color="blue.500">Gmail Organizer</Heading>
                  <GoogleLoginButton
                    profile={profile}
                    setUser={setUser}
                    setProfile={setProfile}
                  />
                </HStack>
                {profile ? (
                  <Box>
                    <Text>Welcome, {profile.given_name}</Text>

                    <VStack align="start" mt={6}>
                      <Input
                        placeholder="Add an email to allow"
                        value={newAllowedEmail}
                        onChange={(e) => setNewAllowedEmail(e.target.value)}
                      />
                      <Button
                        onClick={handleAddAllowedEmail}
                        colorScheme="blue"
                      >
                        Add Allowed Email
                      </Button>

                      <Text mt={4}>
                        <strong>Allowed Emails:</strong>
                      </Text>
                      {allowedEmails.length > 0 ? (
                        allowedEmails.map((email, index) => (
                          <HStack key={index} spacing={4}>
                            <Text>{email}</Text>
                            <IconButton
                              icon={<DeleteIcon />}
                              onClick={() => handleRemoveAllowedEmail(email)}
                              aria-label="Remove email"
                              colorScheme="red"
                              size="sm"
                            />
                          </HStack>
                        ))
                      ) : (
                        <Text>No allowed emails added yet.</Text>
                      )}
                    </VStack>

                    {loadingEmails ? (
                      <Text>Loading emails from allowed senders...</Text>
                    ) : (
                      <EmailOrganizer emails={emails} />
                    )}
                  </Box>
                ) : (
                  <Box>
                    <VStack
                      align="center"
                      spacing={4}
                      maxW="lg"
                      margin="0 auto"
                    >
                      <Heading size="md">
                        Ready to organize your emails?
                      </Heading>
                      <Text align="center">
                        Click the Sign in with Google button at the top right to
                        get started.
                      </Text>
                    </VStack>
                  </Box>
                )}
              </Box>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
