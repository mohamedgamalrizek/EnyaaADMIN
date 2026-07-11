/* eslint-disable react/prop-types */
import {
  Box,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { arEG } from "date-fns/locale";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { daysBack } from "../Controllers/dateConfig";
import { t } from "../lib/arabicUi";

const DateRangeCalender = ({ setDateRange, setLastDays, size, dateRange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - daysBack);

  const [selectionRange, setSelectionRange] = useState({
    startDate: initialStartDate,
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const setDate = () => {
    const startDate = moment(selectionRange.startDate).format("YYYY-MM-DD");
    const endDate = moment(selectionRange.endDate).format("YYYY-MM-DD");
    setDateRange({
      startDate,
      endDate,
    });

    if (setLastDays) {
      setLastDays(calculateDaysDifference(startDate, endDate));
    }
    onClose();
  };

  const calculateDaysDifference = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, "days") + 1;
  };

  const formatDateRange = (startDate, endDate) => {
    const start = moment(startDate).format("D MMM YY");
    const end = moment(endDate).format("D MMM YY");
    return `${start} - ${end}`;
  };

  return (
    <Box>
      <Input
        onClick={onOpen}
        isReadOnly
        size={size || "sm"}
        borderRadius={6}
        value={
          (dateRange?.startDate && dateRange?.endDate) ||
          (selectionRange.startDate && selectionRange.endDate)
            ? formatDateRange(
                dateRange?.startDate || selectionRange?.startDate,
                dateRange?.endDate || selectionRange?.endDate
              )
            : "نطاق تاريخ غير صالح"
        }
        cursor="pointer"
        w={"fit-content"}
        minW={44}
        fontSize="sm"
      />
      <CalenderModal
        isOpen={isOpen}
        onClose={onClose}
        selectionRange={selectionRange}
        handleSelect={handleSelect}
        setDate={setDate}
      />
    </Box>
  );
};

const CalenderModal = ({
  isOpen,
  onClose,
  selectionRange,
  handleSelect,
  setDate,
}) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="md" py={2}>
          اختر نطاق التاريخ
        </ModalHeader>
        <ModalCloseButton top={2} size="sm" />
        <ModalBody p={0}>
          <Box bg={bgColor} color={textColor} borderRadius="md">
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              rangeColors={["#5fc1ab"]}
              locale={arEG}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
            />
          </Box>
          <Box p={2}>
            <Button
              size="sm"
              w="full"
              mt={2}
              colorScheme="blue"
              onClick={setDate}
            >
              {t("Set")}
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DateRangeCalender;
