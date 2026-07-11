import { Badge } from "@chakra-ui/react";
import { t } from "../lib/arabicUi";

const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return (
        <Badge colorScheme="yellow" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Pending")}
        </Badge>
      );
    case "Confirmed":
      return (
        <Badge colorScheme="green" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Confirmed")}
        </Badge>
      );
    case "Rejected":
      return (
        <Badge colorScheme="red" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Rejected")}
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge colorScheme="red" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Cancelled")}
        </Badge>
      );
    case "Completed":
      return (
        <Badge colorScheme="blue" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Completed")}
        </Badge>
      );
    case "Rescheduled":
      return (
        <Badge colorScheme="orange" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Rescheduled")}
        </Badge>
      );
    case "Visited":
      return (
        <Badge colorScheme="purple" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t("Visited")}
        </Badge>
      );
    default:
      return (
        <Badge colorScheme="gray" fontSize={12} letterSpacing={0.5} p={"5px"}>
          {t(status)}
        </Badge>
      );
  }
};

export default getStatusBadge;
