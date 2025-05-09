import {
	Box,
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
  import { useState } from "react";
  import { useOrderDetails } from "../../../frontend/src/store/rentingOrderDetails";
  
  const OrderDetailsTable = ({ order }) => {
	const [updatedReturnStatus, setUpdatedReturnStatus] = useState({
	  ...order,
	  returnStatus: "Pending",
	});
	const { updateReturnStatus } = useOrderDetails();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
  
	const handleUpdateReturnStatus = async (pid, updatedReturnStatus) => {
	  const { success, message } = await updateReturnStatus(pid, updatedReturnStatus);
	  onClose();
	  if (!success) {
		toast({
		  title: "Error",
		  description: message,
		  status: "error",
		  duration: 3000,
		  isClosable: true,
		});
		const updatedOrder = useOrderDetails.getState().orders.find(o => o._id === pid);
		setUpdatedReturnStatus(updatedOrder || updatedReturnStatus);
	  } else {
		toast({
		  title: "Success",
		  description: "Return Request Approved successfully",
		  status: "success",
		  duration: 3000,
		  isClosable: true,
		});
	  }
	};
  
	return (
	  <Box shadow="lg" rounded="lg" overflow="hidden" p={4}>
		<Table variant="simple">
		  <Thead>
			<Tr>
			  <Th>Image</Th>
			  <Th>Equipment Name</Th>
			  <Th>Ref Number</Th>
			  <Th>Price Paid</Th>
			  <Th>Shipping Method</Th>
			  <Th>Rented From</Th>
			  <Th>Due Date</Th>
			  <Th>Return Status</Th>
			  <Th>Action</Th>
			</Tr>
		  </Thead>
		  <Tbody>
			<Tr>
			  <Td fontSize="sm">
				<Image
				  src={`http://localhost:4000/images/${order?.eqID?.eqImage}` || "https://via.placeholder.com/150"}
				  alt={order?.eqID?.eqName || "Equipment Image"}
				  boxSize="60px"
				  objectFit="cover"
				/>
			  </Td>
			  <Td fontSize="sm">{order?.eqID?.eqName || "Equipment Name"}</Td>
			  <Td fontSize="sm">{order?._id}</Td>
			  <Td fontSize="sm">Rs.{order?.TotalPrice || "N/A"}</Td>
			  <Td fontSize="sm">{order?.shippingMethod || "N/A"}</Td>
			  <Td fontSize="sm">{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(order?.rentFrom))}</Td>
			  <Td fontSize="sm">{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(order?.rentTo))}</Td>
			  <Td fontSize="sm">{order?.returnStatus}</Td>
			  <Td fontSize="sm">
				<Button size="sm" onClick={onOpen}>
				  Make Return Request
				</Button>
			  </Td>
			</Tr>
		  </Tbody>
		</Table>
  
		<Modal isOpen={isOpen} onClose={onClose}>
		  <ModalOverlay />
		  <ModalContent>
			<ModalHeader>Make Return Request</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
			  <Input
				placeholder='Return Date'
				name='returnDate'
				type='date'
				value={updatedReturnStatus.returnDate}
				onChange={(e) => setUpdatedReturnStatus({ ...updatedReturnStatus, returnDate: e.target.value })}
			  />
			  <Input hidden readOnly value={updatedReturnStatus.returnStatus} />
			</ModalBody>
			<ModalFooter>
			  <Button colorScheme='blue' mr={3} onClick={() => handleUpdateReturnStatus(order?._id, updatedReturnStatus)}>
				Update
			  </Button>
			  <Button variant='ghost' onClick={onClose}>Cancel</Button>
			</ModalFooter>
		  </ModalContent>
		</Modal>
	  </Box>
	);
  };
  
  export default OrderDetailsTable;