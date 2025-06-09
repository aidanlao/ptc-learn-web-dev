"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

interface ConfirmProjectChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmProjectChangeModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmProjectChangeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Start Project?</ModalHeader>
        <ModalBody>
          <p>
            Starting a project erases any existing progress on an enrolled
            project. Are you sure you want to switch?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onConfirm}>
            Yes, switch
          </Button>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
