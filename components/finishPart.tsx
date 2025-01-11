import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useForm } from "react-hook-form";

import { TUser } from "@/backend/types/authTypes";
import { submitFileToFirebase } from "@/backend/submission/hooks";

export default function FinishPartModal({
  incrementPart,
  user,
  part,
}: {
  incrementPart: Function;
  user: TUser;
  part: number;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();

  const submitFile = async (data: any) => {
    if (data.file[0]) {
      console.log("handle file upload");
      console.log(data.file[0]);
      const file = data.file[0];

      const submissionResult = await submitFileToFirebase({
        user: user,
        file: file,
        partNum: part,
      });

      if (submissionResult.success) {
        incrementPart();
        onClose();
      } else {
        console.log("Error when submitting file to firebase");
        console.log(submissionResult.message);
      }
    } else {
      console.log("Make sure you are uploading a file");
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="mb-5">
        Finish this part
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <form
                onSubmit={handleSubmit((data) => {
                  submitFile(data);
                })}
              >
                <ModalHeader className="flex flex-col gap-1">
                  File Submission
                </ModalHeader>
                <ModalBody>
                  <p>
                    Submit a clear screenshot of your progress for this part.
                    Please take a picture of the compiled website if you can,
                    otherwise submit a picture of the code.
                  </p>
                  <input
                    required
                    accept="image/*"
                    className="file-upload-input"
                    id="file-upload"
                    type="file"
                    {...register("file")}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit">
                    Submit File
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
