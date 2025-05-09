import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useProductStore } from "../../../frontend/src/store/rentingItems";
import { useState, useRef } from "react";
import React from "react";
import axios from "axios";
import "./AdminProductCard.css";
import "boxicons/css/boxicons.min.css";

const AdProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [selectedImage, setSelectedImage] = useState(null);

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // AlertDialog for Delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const [deleteId, setDeleteId] = useState(null);

  const openConfirmDialog = (pid) => {
    setDeleteId(pid);
    setIsConfirmOpen(true);
  };

  const confirmDeleteProduct = async () => {
    const { success, message } = await deleteProduct(deleteId);
    setIsConfirmOpen(false);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // Update Product
  const handleUpdateProduct = async (pid) => {
    const formData = new FormData();
    formData.append("eqName", updatedProduct.eqName);
    formData.append("eqDescription", updatedProduct.eqDescription);
    formData.append("eqPrice", updatedProduct.eqPrice);
    formData.append("eqAvailability", updatedProduct.eqAvailability);

    if (selectedImage) {
      formData.append("eqImage", selectedImage);
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/rentingItems/${pid}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { success, message } = await updateProduct(pid, res.data.data);
      onClose();

      toast({
        title: success ? "Success" : "Error",
        description: success ? "Product updated successfully" : message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <React.Fragment>
      <div className="card-product">
        <div className="card-product-img">
          <img
            src={`http://localhost:4000/images/${product.eqImage}`}
            alt={product.eqName}
            className="product-img"
          />
        </div>

        <div className="card-product-body">
          <div className="flex-item">
            <h1 className="product-name">{product.eqName}</h1>
            <p className="product-price">Rs. {product.eqPrice}/day</p>
          </div>
        </div>

        <div className="product-rate">
          <i className="bx bx-star icon-rate"></i>
          <p>4.5</p>
        </div>

        <ButtonGroup gap={5}>
          <IconButton
            icon={<EditIcon />}
            onClick={onOpen}
            colorScheme="blue"
            size={"sm"}
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => openConfirmDialog(product._id)}
            colorScheme="red"
            size={"sm"}
          />
        </ButtonGroup>
      </div>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Equipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="eqName"
                value={updatedProduct.eqName}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    eqName: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Description"
                name="eqDescription"
                value={updatedProduct.eqDescription}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    eqDescription: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Price Per Day"
                name="eqPrice"
                value={updatedProduct.eqPrice}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    eqPrice: e.target.value,
                  })
                }
              />
              <Select
                placeholder="Select Availability"
                name="eqAvailability"
                value={updatedProduct.eqAvailability}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    eqAvailability: e.target.value,
                  })
                }
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </Select>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              {selectedImage && (
                <div>
                  <h3>Selected Image</h3>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    width="200"
                  />
                </div>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this product?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteProduct} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </React.Fragment>
  );
};

export default AdProductCard;
