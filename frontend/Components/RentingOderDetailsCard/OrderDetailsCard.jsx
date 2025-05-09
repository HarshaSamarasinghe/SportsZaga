// import {
//   Box,
//   Flex,
//   Heading,
//   Image,
//   Text,
//   Divider,
//   Button,
//   Input,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalOverlay,
//   useDisclosure,
//   useToast,
//   VStack,
//   ButtonGroup,
// } from "@chakra-ui/react";
// import { React, useState } from "react";
// import { useOrderDetails } from "../../src/Store/rentingOrderDetails";
// import { Link } from "react-router-dom";

// const OrderDetailsCard = ({ order }) => {
//   //const [updatedReturnStatus, setUpdatedReturnStatus] = useState(order);
//   const [updatedReturnStatus, setUpdatedReturnStatus] = useState({
//     ...order,
//     returnStatus: "Pending",
//   });

//   const { updateReturnStatus } = useOrderDetails();
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const handleUpdateReturnStatus = async (pid, updatedReturnStatus) => {
//     const { success, message } = await updateReturnStatus(
//       pid,
//       updatedReturnStatus
//     );
//     onClose();
//     if (!success) {
//       toast({
//         title: "Error",
//         description: message,
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       const updatedOrder = useOrderDetails
//         .getState()
//         .orders.find((o) => o._id === pid);
//       setUpdatedReturnStatus(updatedOrder || updatedReturnStatus);
//     } else {
//       toast({
//         title: "Success",
//         description: "Return Request Sent successfully",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box
//       shadow="lg"
//       rounded="lg"
//       overflow="hidden"
//       transition="all 0.3s"
//       _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
//       minW={700}
//       minH={260}
//     >
//       <Flex>
//         <Box w={200} borderRight={"1px"} borderColor={"grey"}>
//           <Image
//             src={
//               `http://localhost:4000/images/${order?.eqID?.eqImage}` ||
//               "https://via.placeholder.com/150"
//             } // Added fallback image
//             alt={order?.eqID?.eqName || "Equipment Image"}
//             h="full"
//             w="full"
//             objectFit="cover" // Changed from 'fill' to 'cover'
//           />
//         </Box>

//         <Box flex="2" ml={{ md: 4 }} paddingLeft={4}>
//           <Heading as="h3" size="lg" mb={2}>
//             {order?.eqID?.eqName || "Equipment Name"}
//           </Heading>

//           <Flex direction="column" gap={2}>
//             <Box>
//               <Text fontWeight="bold" fontSize="md">
//                 Ref Number:{" "}
//                 <span style={{ fontWeight: "normal" }}>{order?._id}</span>
//               </Text>
//               <Text fontWeight="bold" fontSize="md">
//                 Price Paid:{" "}
//                 <span style={{ fontWeight: "normal" }}>
//                   Rs.{order?.TotalPrice || "N/A"}
//                 </span>
//               </Text>
//               <Text fontWeight="bold" fontSize="md">
//                 Shipping Method:{" "}
//                 <span style={{ fontWeight: "normal" }}>
//                   {order?.shippingMethod || "N/A"}
//                 </span>
//               </Text>
//             </Box>
//             <Divider />

//             <Box mt={2}>
//               <Text fontWeight="bold" fontSize="md">
//                 Rented From:{" "}
//                 <span style={{ fontWeight: "normal" }}>
//                   {new Intl.DateTimeFormat("en-GB", {
//                     day: "2-digit",
//                     month: "long",
//                     year: "numeric",
//                   }).format(new Date(order?.rentFrom))}
//                 </span>
//               </Text>
//               <Text fontWeight="bold" fontSize="md">
//                 Rented To:{" "}
//                 <span style={{ fontWeight: "normal" }}>
//                   {new Intl.DateTimeFormat("en-GB", {
//                     day: "2-digit",
//                     month: "long",
//                     year: "numeric",
//                   }).format(new Date(order?.rentTo))}
//                 </span>
//               </Text>
//               <Text fontWeight="bold" fontSize="md">
//                 Return Status:{" "}
//                 <span style={{ fontWeight: "normal" }}>
//                   {order?.returnStatus}
//                 </span>
//               </Text>
//               {order?.fineValue > 0 && (
//                 <Text fontWeight="bold" fontSize="md">
//                   Fine to Pay :{" "}
//                   <span style={{ fontWeight: "normal" }}>
//                     Rs.{order?.fineValue}
//                   </span>
//                 </Text>
//               )}

//               <ButtonGroup gap={5}>

//                 {order?.returnStatus !== "Successful" && (
//                   <Button size="sm" onClick={onOpen}>
//                     Make Return Request
//                   </Button>
//                 )}

//                 {order?.returnStatus === "Fine" && (
//                   <Button size={"sm"} as={Link} to="/">
//                     Pay Fine
//                   </Button>
//                 )}
//               </ButtonGroup>
//             </Box>
//           </Flex>
//         </Box>
//       </Flex>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />

//         <ModalContent>
//           <ModalCloseButton />
//           <ModalBody>
//             <VStack spacing={4}>
//               <Text fontSize={"lg"} fontWeight={"medium"}>
//                 Enter Today Date
//               </Text>
//               <Input
//                 placeholder="Return Date"
//                 name="returnDate"
//                 type="date"
//                 value={updatedReturnStatus.returnDate}
//                 onChange={(e) =>
//                   setUpdatedReturnStatus({
//                     ...updatedReturnStatus,
//                     returnDate: e.target.value,
//                   })
//                 }
//               />

//               <Input hidden readOnly value={updatedReturnStatus.returnStatus} />
//             </VStack>
//           </ModalBody>

//           <ModalFooter>
//             <Button
//               colorScheme="blue"
//               mr={3}
//               size={"sm"}
//               onClick={() =>
//                 handleUpdateReturnStatus(order?._id, updatedReturnStatus)
//               }
//             >
//               Request a Return
//             </Button>
//             <Button variant="ghost" onClick={onClose} size={"sm"}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default OrderDetailsCard;
