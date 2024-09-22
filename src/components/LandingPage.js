import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Mail, Inbox, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import hero_img from "../assets/hero_img.png";

const Feature = ({ icon, title, text }) => {
  return (
    <HStack align="top" spacing={4}>
      <Box fontSize="3xl" color="blue.500">
        {icon}
      </Box>
      <VStack align="start">
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text color="gray.600">{text}</Text>
      </VStack>
    </HStack>
  );
};

const LandingPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={25} px={20}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          <VStack align="start" spacing={8} maxW="lg">
            <Heading as="h1" size="2xl" fontWeight="bold" color="blue.500">
              Streamline Your Inbox
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Access and organize your Gmail inbox effortlessly. Specify email
              addresses and take control of your communication.
            </Text>
            <Link to="/organizer">
              {/* <Button colorScheme="teal" size="lg">
                Get Started
              </Button> */}
              <Button colorScheme="blue" size="lg" leftIcon={<Mail />}>
                Get Started
              </Button>
            </Link>
          </VStack>
          <Flex mt={{ base: 12, md: 0 }} justifyContent='center' alignItems='center'>
            <Image
              src={hero_img}
              alt="Email Organizer App"
              borderRadius="lg"
              shadow="2xl"
              width='50%'
            />
          </Flex>
        </Flex>

        <VStack spacing={16} mt={20}>
          <Heading as="h2" size="xl" textAlign="center" color="blue.500">
            Key Features
          </Heading>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-evenly"
            w="full"
            spacing={8}
          >
            <Feature
              icon={<Inbox />}
              title="Gmail Integration"
              text="Seamlessly connect and access your Gmail inbox within our app."
            />
            <Feature
              icon={<Filter />}
              title="Custom Filters"
              text="Specify email addresses to focus on what matters most to you."
            />
            <Feature
              icon={<Mail />}
              title="Efficient Organization"
              text="Organize and manage your emails with powerful tools and intuitive interface."
            />
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage;
