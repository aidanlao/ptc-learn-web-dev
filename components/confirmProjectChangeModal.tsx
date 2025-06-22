"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";

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
            project. Are you sure you want to start?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onConfirm}>
            Yes
          </Button>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
