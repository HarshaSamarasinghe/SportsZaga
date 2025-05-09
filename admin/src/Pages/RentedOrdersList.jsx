// import { Container, Text, VStack, Table, Thead, Tbody, Tr, Th, Td, Image, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Input, useDisclosure, useToast } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useOrderDetails } from "../../../frontend/src/store/rentingOrderDetails";
// import { IconButton } from '@chakra-ui/react';
// import { InfoIcon } from '@chakra-ui/icons';
// import { useNavigate } from "react-router-dom"
// import './RentedOrdersList.css'; // Import your CSS file for styling

// const RentedOrdersList = () => {

//     const navigate = useNavigate();
//     const { updateReturnStatus } = useOrderDetails();
//     const [orders, setOrders] = useState([]);
//     const [updatedReturnStatus, setUpdatedReturnStatus] = useState({
//         returnStatus: "Fine",
//         fineValue: 0
//     });
//     const [selectedOrder, setSelectedOrder] = useState(null); // To store the selected order
//     const toast = useToast();
//     const { isOpen, onOpen, onClose } = useDisclosure();

//     // Fetch the orders from the API
//     const fetchOrders = async () => {
//         try {
//           const response = await axios.get(
//             "http://localhost:4000/api/RentingOrderDetails/list" // Your API endpoint
//           );
//           setOrders(response.data.data); // Set the fetched data to the orders state

//         } catch (error) {
//           console.error("There was an error fetching the orders!", error);

//         }
//       };

//     useEffect(() => {

//         fetchOrders();
//       }, []);

//     const calculateFineValue = (rentTo, returnDate) => {
//         const lateDays = Math.max(
//             0,
//             Math.ceil((new Date(returnDate) - new Date(rentTo)) / (1000 * 60 * 60 * 24))
//         );
//         return lateDays * 100; // Fine is 100 per late day
//     };

//     const handleOpenModal = (order) => {
//         setSelectedOrder(order); // Store the selected order
//         const fineValue = calculateFineValue(order?.rentTo, order?.returnDate); // Calculate fine dynamically
//         setUpdatedReturnStatus({

//            fineValue: fineValue,
//         returnStatus: fineValue === 0 ? "Successful" : "Fine"
//         });
//         onOpen();
//     };

//     const handleGenerateReport = () => {
//         navigate('/generate-renting-reports');
//     };

//     const handleUpdateReturnStatus = async (pid, updatedReturnStatus) => {

//         const { success, message } = await updateReturnStatus(pid, updatedReturnStatus);
//         onClose();
//         if (!success) {
//             toast({
//                 title: "Error",
//                 description: message,
//                 status: "error",
//                 duration: 3000,
//                 isClosable: true,
//             });
//         } else {
//             toast({
//                 title: "Success",
//                 description: "Return Request Approved successfully",
//                 status: "success",
//                 duration: 3000,
//                 isClosable: true,
//             });
//             await fetchOrders(); // Fetch the updated orders list after updating the status
//         }
//     };

//     return (
//         <Container maxW="container.xl" py={12}>
//             <VStack spacing={8}>
//                 <Text fontSize={30} fontWeight="bold" bgColor={'black'} bgClip="text" textAlign="center">
//                     Return Request List
//                 </Text>

//                 <Table variant="simple">
//                     <Thead>
//                         <Tr>
//                             <Th>Image</Th>
//                             <Th>Equipment Name</Th>
//                             <Th>Ref Number</Th>
//                             <Th>Price Paid</Th>
//                             <Th>Return Requested Date</Th>
//                             <Th>Rented From</Th>
//                             <Th>Due Date</Th>
//                             <Th>Return Status</Th>
//                             <Th>Fine Value</Th>
//                             <Th>Action</Th>
//                         </Tr>
//                     </Thead>
//                     <Tbody>
//                         {(orders ?? [])
//                             //.filter((order) => order?.returnStatus === "Pending") // Filter for Pending returns
//                             .map((order) => (
//                                 <Tr key={order?._id}>
//                                     <Td fontSize="sm">
//                                         <Image
//                                             src={`http://localhost:4000/images/${order?.eqID?.eqImage}` || "https://via.placeholder.com/150"}
//                                             alt={order?.eqID?.eqName || "Equipment Image"}
//                                             boxSize="60px"
//                                             objectFit="cover"
//                                         />
//                                     </Td>
//                                     <Td fontSize="sm">{order?.eqID?.eqName || "Equipment Name"}</Td>
//                                     <Td fontSize="sm">{order?._id}</Td>
//                                     <Td fontSize="sm">Rs.{order?.TotalPrice || "N/A"}</Td>
//                                     <Td fontSize="sm">
//                                         {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" })
//                                             .format(new Date(order?.returnDate))}
//                                     </Td>
//                                     <Td fontSize="sm">
//                                         {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" })
//                                             .format(new Date(order?.rentFrom))}
//                                     </Td>
//                                     <Td fontSize="sm">
//                                         {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" })
//                                             .format(new Date(order?.rentTo))}
//                                     </Td>
//                                     <Td fontSize="sm">{order?.returnStatus}</Td>
//                                     <Td fontSize="sm">
//                                         {calculateFineValue(order?.rentTo, order?.returnDate)}
//                                     </Td>

//                                     <Td fontSize="sm">
//                                         <IconButton
//                                             onClick={() => handleOpenModal(order)}  // Pass order to open the modal
//                                             fontSize="20px"
//                                             icon={<InfoIcon />}
//                                         />
//                                     </Td>
//                                 </Tr>
//                             ))}
//                     </Tbody>
//                 </Table>
//                 <button
//                     onClick={handleGenerateReport}
//                     className="rep-generate-report-btn"
//                 >
//                     Generate Report
//                 </button>

//                 <Modal isOpen={isOpen} onClose={onClose}>
//                     <ModalOverlay />
//                     <ModalContent>
//                         <ModalHeader>View Return Request Status</ModalHeader>
//                         <ModalCloseButton />
//                         <ModalBody>
//                             <Input hidden readOnly value={updatedReturnStatus.returnStatus} />
//                             <Input hidden readOnly value={updatedReturnStatus.fineValue} />
//                         </ModalBody>
//                         <ModalFooter>
//                             <Button
//                                 colorScheme='blue'
//                                 mr={3}
//                                 onClick={() => handleUpdateReturnStatus(selectedOrder?._id, updatedReturnStatus)}
//                             >
//                                 Approve Request
//                             </Button>
//                             <Button variant='ghost' onClick={onClose}>Cancel</Button>
//                         </ModalFooter>
//                     </ModalContent>
//                 </Modal>

//             </VStack>
//         </Container>
//     );
// };

// export default RentedOrdersList;

import {
  Container,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOrderDetails } from "../../../frontend/src/store/rentingOrderDetails";
import { IconButton } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import "./RentedOrdersList.css";

const RentedOrdersList = () => {
  const navigate = useNavigate();
  const { updateReturnStatus } = useOrderDetails();
  const [orders, setOrders] = useState([]);
  const [updatedReturnStatus, setUpdatedReturnStatus] = useState({
    returnStatus: "Fine",
    fineValue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/RentingOrderDetails/list"
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateFineValue = (rentTo, returnDate) => {
    const lateDays = Math.max(
      0,
      Math.ceil(
        (new Date(returnDate) - new Date(rentTo)) / (1000 * 60 * 60 * 24)
      )
    );
    return lateDays * 100;
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    const fineValue = calculateFineValue(order?.rentTo, order?.returnDate);
    setUpdatedReturnStatus({
      fineValue: fineValue,
      returnStatus: fineValue === 0 ? "Successful" : "Fine",
    });
    onOpen();
  };

  const handleGenerateReport = () => {
    navigate("/generate-renting-reports");
  };

  const handleUpdateReturnStatus = async (pid, updatedReturnStatus) => {
    const { success, message } = await updateReturnStatus(
      pid,
      updatedReturnStatus
    );
    onClose();
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "Return Request Approved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchOrders();
    }
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text
          fontSize={30}
          fontWeight="bold"
          bgColor={"black"}
          bgClip="text"
          textAlign="center"
        >
          Return Request List
        </Text>

        <div className="rep-filters-container">
          <Input
            placeholder="Search by Equipment Name..."
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="rep-search-input"
            variant="filled"
          />
          <div className="rep-sort-wrapper">
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rep-sort-select"
              value={statusFilter}
            >
              <option value="">All</option>
              <option value="Successful">Successful</option>
              <option value="Fine">Fine</option>
              <option value="Pending">Pending</option>
              <option value="Not Returned">Not Returned</option>
            </select>
          </div>
        </div>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Equipment Name</Th>
              <Th>Ref Number</Th>
              <Th>Price Paid</Th>
              <Th>Return Requested Date</Th>
              <Th>Rented From</Th>
              <Th>Due Date</Th>
              <Th>Return Status</Th>
              <Th>Fine Value</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(orders ?? [])
              .filter(
                (order) =>
                  order?.eqID?.eqName?.toLowerCase().includes(searchQuery) &&
                  (statusFilter === "" || order?.returnStatus === statusFilter)
              )
              .map((order) => (
                <Tr key={order?._id}>
                  <Td fontSize="sm">
                    <Image
                      src={
                        `http://localhost:4000/images/${order?.eqID?.eqImage}` ||
                        "https://via.placeholder.com/150"
                      }
                      alt={order?.eqID?.eqName || "Equipment Image"}
                      boxSize="60px"
                      objectFit="cover"
                    />
                  </Td>
                  <Td fontSize="sm">
                    {order?.eqID?.eqName || "Equipment Name"}
                  </Td>
                  <Td fontSize="sm">{order?._id}</Td>
                  <Td fontSize="sm">Rs.{order?.TotalPrice || "N/A"}</Td>
                  <Td fontSize="sm">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(order?.returnDate))}
                  </Td>
                  <Td fontSize="sm">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(order?.rentFrom))}
                  </Td>
                  <Td fontSize="sm">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(order?.rentTo))}
                  </Td>
                  <Td fontSize="sm">{order?.returnStatus}</Td>
                  <Td fontSize="sm">
                    {calculateFineValue(order?.rentTo, order?.returnDate)}
                  </Td>
                  <Td fontSize="sm">
                    <IconButton
                      onClick={() => handleOpenModal(order)}
                      fontSize="20px"
                      icon={<InfoIcon />}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>

        <button
          onClick={handleGenerateReport}
          className="rep-generate-report-btn"
        >
          Generate Report
        </button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Return Request Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input hidden readOnly value={updatedReturnStatus.returnStatus} />
              <Input hidden readOnly value={updatedReturnStatus.fineValue} />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() =>
                  handleUpdateReturnStatus(
                    selectedOrder?._id,
                    updatedReturnStatus
                  )
                }
              >
                Approve Request
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default RentedOrdersList;
