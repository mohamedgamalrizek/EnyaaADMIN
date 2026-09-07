/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Skeleton,
  theme,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DynamicTable from "../../Components/DataTable";
import { GET } from "../../Controllers/ApiControllers";
import admin from "../../Controllers/admin";
import moment from "moment";
import { Link } from "react-router-dom";
import printPDF from "../../Controllers/printPDF";
import api from "../../Controllers/api";
import { TbDownload, TbFileExport } from "react-icons/tb";
import useHasPermission from "../../Hooks/HasPermission";
import NotAuth from "../../Components/NotAuth";
import useDebounce from "../../Hooks/useDebounce";
import Pagination from "../../Components/Pagination";
import DateRangeCalender from "../../Components/DateRangeCalender";
import exportExcel from "../../Controllers/exportExcel";


const getPageIndices = (currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage - 1;
  return { startIndex, endIndex };
};

const paymentExportColumns = [
  { key: "id", label: "ID" },
  { key: "txn_id", label: "Transaction ID" },
  { key: "invoice_id", label: "Invoice ID" },
  { key: "patient", label: "Patient" },
  { key: "user", label: "User" },
  { key: "appointment_id", label: "Appointment ID" },
  { key: "amount", label: "Amount" },
  { key: "payment_method", label: "Payment Method" },
  { key: "payment_time_stamp", label: "Payment Timestamp" },
  { key: "created_at", label: "Created At" },
];

const mapPaymentExportRow = (payment) => ({
  id: payment.id,
  txn_id: payment.txn_id || "N/A",
  invoice_id: payment.invoice_id || "N/A",
  patient: payment.patient_f_name
    ? `${payment.patient_f_name || ""} ${payment.patient_l_name || ""}`.trim()
    : "N/A",
  user: payment.user_f_name
    ? `${payment.user_f_name || ""} ${payment.user_l_name || ""}`.trim()
    : "N/A",
  appointment_id: payment.appointment_id,
  amount: payment.amount,
  payment_method: payment.payment_method || "N/A",
  payment_time_stamp: payment.payment_time_stamp
    ? moment(payment.payment_time_stamp).format("D MMM YY hh.mmA")
    : "N/A",
  created_at: payment.created_at
    ? moment(payment.created_at).format("D MMM YY hh:mmA")
    : "N/A",
});

export default function AppointmentPayments() {
  const { hasPermission } = useHasPermission();
  const [SelectedData, setSelectedData] = useState();
  const [page, setPage] = useState(1);
  const boxRef = useRef(null);
  const [searchQuery, setsearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [dateRange, setdateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isExporting, setIsExporting] = useState(false);

  const start_date = dateRange.startDate
    ? moment(dateRange.startDate).format("YYYY-MM-DD")
    : "";
  const end_date = dateRange.endDate
    ? moment(dateRange.endDate).format("YYYY-MM-DD")
    : "";

  const toast = useToast();
  const id = "Errortoast";

  const getData = async () => {
    const { startIndex, endIndex } = getPageIndices(page, 50);
    const url =
      admin.role.name === "Doctor"
        ? `get_appointment_payments/page?start=${startIndex}&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}&doctor_id=${admin.id}`
        : `get_appointment_payments/page?start=${startIndex}&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}`;
    const res = await GET(admin.token, url);

    const rearrangedTransactions = res?.data.map((transaction) => {
      const {
        id,
        txn_id,
        invoice_id,
        amount,
        payment_time_stamp,
        payment_method,
        created_at,
        user_id,
        patient_id,
        appointment_id,
        patient_f_name,
        patient_l_name,
        user_f_name,
        user_l_name,
      } = transaction;

      return {
        id,
        "txn ID": txn_id,
        invoiceID: invoice_id,
        patient: patient_f_name ? (
          <Link to={`/patient/${patient_id}`}>
            {`${patient_f_name} ${patient_l_name}`}
          </Link>
        ) : (
          "N/A"
        ),
        user: user_f_name ? (
          <Link to={`/user/${user_id}`}>{`${user_f_name} ${user_l_name}`}</Link>
        ) : (
          "N/A"
        ),
        "APP ID": (
          <Link to={`/appointment/${appointment_id}`}>{appointment_id}</Link>
        ),
        amount,
        "payment Method": payment_method,
        "payment Time stamp":
          moment(payment_time_stamp).format("D MMM YY hh.mmA"),
        "created At": moment(created_at).format("D MMM YY hh:mmA"),
      };
    });

    return {
      data: rearrangedTransactions,
      total_record: res.total_record,
    };
  };

  const handleActionClick = (rowData) => {
    setSelectedData(rowData);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["appointment-payments", page, debouncedSearchQuery, dateRange],
    queryFn: getData,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const endIndex = Math.max((data?.total_record || 50) - 1, 49);
      const url =
        admin.role.name === "Doctor"
          ? `get_appointment_payments/page?start=0&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}&doctor_id=${admin.id}`
          : `get_appointment_payments/page?start=0&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}`;
      const res = await GET(admin.token, url);
      const rows = res?.data?.map(mapPaymentExportRow) || [];

      if (!rows.length) {
        toast({
          title: "No payments to export.",
          status: "warning",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
        return;
      }

      exportExcel({
        title: "Appointment Payments",
        filename: "appointment-payments",
        columns: paymentExportColumns,
        rows,
      });
    } catch {
      toast({
        title: "Failed to export payments.",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const totalPage = Math.ceil(data?.total_record / 50);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  if (error) {
    if (!toast.isActive(id)) {
      toast({
        id,
        title: "oops!.",
        description: "Something bad happens.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }

  if (!hasPermission("APPOINTMENT_PAYMENTS_VIEW")) return <NotAuth />;

  return (
    <Box>
      {isLoading || !data ? (
        <Box>
          <Flex mb={5} justify={"space-between"}>
            <Skeleton w={400} h={8} />
            <Skeleton w={50} h={8} />
          </Flex>
          <Skeleton h={300} w={"100%"} />
        </Box>
      ) : (
        <Box>
          <Flex mb={5} justify={"space-between"} align={"center"}>
            <Flex align={"center"} gap={4}>
              {" "}
              <Input
                size={"md"}
                placeholder="Search"
                w={400}
                maxW={"50vw"}
                onChange={(e) => setsearchQuery(e.target.value)}
              />
              <DateRangeCalender
                dateRange={dateRange}
                setDateRange={setdateRange}
                size={"md"}
              />
            </Flex>
            <Button
              size={"sm"}
              colorScheme="green"
              leftIcon={<TbFileExport />}
              onClick={handleExport}
              isLoading={isExporting}
            >
              Export Excel
            </Button>
          </Flex>
          <DynamicTable
            data={data ? data.data : []}
            onActionClick={
              <YourActionButton
                onClick={handleActionClick}
                rowData={SelectedData}
              />
            }
          />
        </Box>
      )}
      <Flex justify={"center"} mt={4}>
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPage}
        />
      </Flex>
    </Box>
  );
}

const YourActionButton = ({ onClick, rowData }) => {
  return (
    <Flex justify={"center"}>
      <IconButton
        size={"sm"}
        variant={"ghost"}
        _hover={{
          background: "none",
        }}
        onClick={() => {
          onClick(rowData);
          printPDF(`${api}/invoice/generatePDF/${rowData.invoiceID}`);
        }}
        icon={<TbDownload fontSize={18} color={theme.colors.blue[500]} />}
      />
    </Flex>
  );
};
