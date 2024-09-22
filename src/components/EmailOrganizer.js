import React from "react";
import { Box, List, ListItem, Text, HStack } from "@chakra-ui/react";

const EmailOrganizer = ({ emails }) => {
  return (
    <Box mt={6}>
      <Text fontSize="xl" mb={4}>
        <strong>Your Emails:</strong>
      </Text>

      {emails.length > 0 ? (
        <List spacing={3}>
          {emails.map((email, index) => (
            <ListItem
              key={index}
              border="1px"
              borderColor="gray.200"
              p={4}
              borderRadius="md"
            >
              <HStack>
                <Text>
                  <strong>From:</strong> {email.from}
                </Text>
                <Text>
                  <strong>Date:</strong> {email.date}
                </Text>
              </HStack>
              <Text>
                <strong>Subject:</strong> {email.subject}
              </Text>
              <Text>
                <strong>Body:</strong> {email.body}
              </Text>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No emails from allowed senders found.</Text>
      )}
    </Box>
  );
};

export default EmailOrganizer;
