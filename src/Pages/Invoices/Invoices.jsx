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
import { TbDownload, TbFileExport } from "react-icons/tb";
import api from "../../Controllers/api";
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
const id = "Errortoast";

const invoiceExportColumns = [
  { key: "id", label: "ID" },
  { key: "status", label: "Status" },
  { key: "total_amount", label: "Total Amount" },
  { key: "coupon_title", label: "Applied Coupon" },
  { key: "coupon_value", label: "Coupon Value (%)" },
  { key: "coupon_off_amount", label: "Coupon Off Amount" },
  { key: "invoice_date", label: "Invoice Date" },
  { key: "patient", label: "Patient" },
  { key: "user", label: "User" },
  { key: "appointment_id", label: "Appointment ID" },
  { key: "created_at", label: "Created At" },
];

const mapInvoiceExportRow = (invoice) => ({
  id: invoice.id,
  status: invoice.status || "N/A",
  total_amount: invoice.total_amount,
  coupon_title: invoice.coupon_title || "N/A",
  coupon_value: invoice.coupon_value || "N/A",
  coupon_off_amount: invoice.coupon_off_amount || 0,
  invoice_date: invoice.invoice_date
    ? moment(invoice.invoice_date).format("D MMM YY")
    : "N/A",
  patient: invoice.patient_f_name
    ? `${invoice.patient_f_name || ""} ${invoice.patient_l_name || ""}`.trim()
    : "N/A",
  user: invoice.user_id
    ? `${invoice.user_f_name || ""} ${invoice.user_l_name || ""}`.trim()
    : "N/A",
  appointment_id: invoice.appointment_id,
  created_at: invoice.created_at
    ? moment(invoice.created_at).format("D MMM YY hh:mmA")
    : "N/A",
});

export default function Invoices() {
  const [SelectedData, setSelectedData] = useState();
  const { hasPermission } = useHasPermission();
  const toast = useToast();
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

  const { startIndex, endIndex } = getPageIndices(page, 50);

  const getData = async () => {
    const url =
      admin.role.name === "Doctor"
        ? `get_invoices/page?start=${startIndex}&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}&doctor_id=${admin.id}`
        : `get_invoices/page?start=${startIndex}&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}`;
    const res = await GET(admin.token, url);
    const rearrangedInvoices = res?.data.map((invoice) => {
      const {
        id,
        user_id,
        patient_id,
        appointment_id,
        status,
        total_amount,
        invoice_date,
        created_at,
        patient_f_name,
        patient_l_name,
        user_f_name,
        user_l_name,
        coupon_title,
        coupon_value,
        coupon_off_amount,
      } = invoice;

      return {
        id,
        status,
        total_Amount: total_amount,
        applied_coupon: coupon_title || "N/A",
        "coupon value (%)": coupon_value || "N/A",
        coupon_off_amount: coupon_off_amount || 0,
        invoice_Date: moment(invoice_date).format("D MMM YY"),
        patient: patient_f_name ? (
          <Link to={`/patient/${patient_id}`}>
            {`${patient_f_name} ${patient_l_name}`}
          </Link>
        ) : (
          "N/A"
        ),
        user: user_id ? (
          <Link to={`/user/${user_id}`}>{`${user_f_name} ${user_l_name}`}</Link>
        ) : (
          "N/A"
        ),
        appointmentID: (
          <Link to={`/appointment/${appointment_id}`}>{appointment_id}</Link>
        ),
        createdAt: moment(created_at).format("D MMM YY hh:mmA"),
      };
    });
    return {
      data: rearrangedInvoices,
      total_record: res.total_record,
    };
  };

  const handleActionClick = (rowData) => {
    setSelectedData(rowData);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["invoices", page, debouncedSearchQuery, dateRange],
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
          ? `get_invoices/page?start=0&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}&doctor_id=${admin.id}`
          : `get_invoices/page?start=0&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${start_date}&end_date=${end_date}`;
      const res = await GET(admin.token, url);
      const rows = res?.data?.map(mapInvoiceExportRow) || [];

      if (!rows.length) {
        toast({
          title: "No invoices to export.",
          status: "warning",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
        return;
      }

      exportExcel({
        title: "Invoices",
        filename: "invoices",
        columns: invoiceExportColumns,
        rows,
      });
    } catch {
      toast({
        title: "Failed to export invoices.",
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

  if (error) {
    if (!toast.isActive(id)) {
      toast({
        id,
        title: "oops!",
        description: "Something bad happens.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  if (!hasPermission("APPOINTMENT_INVOICE_VIEW")) return <NotAuth />;

  return (
    <Box ref={boxRef}>
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
            data={data?.data}
            onActionClick={
              <YourActionButton
                rowData={SelectedData}
                onClick={handleActionClick}
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
  const printPdf = (pdfUrl) => {
    const newWindow = window.open(pdfUrl, "_blank");
    if (newWindow) {
      newWindow.focus();
      newWindow.onload = () => {
        newWindow.load();
        newWindow.onafterprint = () => {
          newWindow.close();
        };
      };
    }
  };
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
          printPdf(`${api}/invoice/generatePDF/${rowData.id}`);
        }}
        icon={<TbDownload fontSize={18} color={theme.colors.blue[500]} />}
      />
    </Flex>
  );
};
