import React, { useEffect, useState } from "react";
import {Table, Input, Button, Descriptions, Modal} from "antd";
import { FilterOutlined,EyeOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import html2canvas from "html2canvas-pro";
import {InvoceApi} from "../service/invoice/invoice.ts";

const { Search } = Input;

const InvoiceUser = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("da_thanh_toan");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Fetch data from API
    const fetchData = async (currentPage, pageSize, query = "", status = "") => {
        setLoading(true);
        try {
            let params={
                page: currentPage,
                size: pageSize,
                status
            }
            if(query && query.length>0){
                params={...params,key:query}
            }
            const response = await InvoceApi.getInvoiceUser(params);

            //     axios.get("http://your-api-url/invoices", {
            //     params: {
            //         page: currentPage,
            //         size: pageSize,
            //         search: query,
            //     },
            // });
            if(response?.data?.isSuccess){
                setData(response?.data?.data?.content||[]);
            }
            else{
                setData([])
            }
            // Cấu trúc dữ liệu giả định
            setPagination({
                current: currentPage,
                pageSize,
                total: response?.data?.data?.totalElements||0,
            });
        } catch (error) {
            setData([])
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize,"",filterStatus);
    }, []);

    // Handle table change (pagination, filters, sorter)
    const handleTableChange = (pagination) => {
        fetchData(pagination.current, pagination.pageSize, searchText);
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
        fetchData(1, pagination.pageSize, value);
    };
    const toggleFilter = () => {
        const newStatus = filterStatus === "CHUA_THANH_TOAN" ? "DA_THANH_TOAN" : "CHUA_THANH_TOAN";
        setFilterStatus(newStatus);
        fetchData(1, pagination.pageSize, searchText, newStatus);
    };
    // Open modal with selected invoice details
    const showInvoiceDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalVisible(true);
    };

    // Close modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedInvoice(null);
    };
    const handleDownloadPDF = async () => {
        // const modalContent = document.getElementById("invoice-detail-content"); // Chọn phần cần in
        //
        // // Sử dụng html2canvas để render HTML thành canvas
        // const canvas = await html2canvas(modalContent);
        // const imgData = canvas.toDataURL("image/png");
        //
        // // Tạo file PDF
        // const pdf = new jsPDF();
        // const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        //
        // pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Thêm ảnh vào PDF
        // pdf.save(`invoice_${selectedInvoice?.id || "detail"}.pdf`); // Tải file PDF xuống
        const modalContent = document.getElementById("invoice-detail-content"); // Chọn phần cần in

        try {
            // Sử dụng html2canvas-pro để render HTML thành canvas
            const canvas = await html2canvas(modalContent, {
                useCORS: true, // Hỗ trợ tải tài nguyên CORS
                scale: 2, // Tăng độ phân giải ảnh
                logging: true, // Ghi lại log để kiểm tra lỗi (bạn có thể tắt nếu không cần)
                allowTaint: true, // Cho phép vẽ tài nguyên từ các nguồn không cùng domain
            });

            const imgData = canvas.toDataURL("image/png");

            // Tạo file PDF
            const pdf = new jsPDF("p", "mm", "a4"); // Portrait, đơn vị mm, khổ giấy A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Nếu nội dung vừa với một trang PDF
            if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Thêm ảnh vào PDF
            } else {
                // Nếu nội dung dài hơn một trang PDF, chia thành nhiều trang
                let position = 0;
                const pageHeight = pdf.internal.pageSize.getHeight();

                while (position < canvas.height) {
                    const canvasSection = document.createElement("canvas");
                    canvasSection.width = canvas.width;
                    canvasSection.height = Math.min(pageHeight * canvas.width / pdfWidth, canvas.height - position);

                    const ctx = canvasSection.getContext("2d");
                    ctx.drawImage(
                        canvas,
                        0,
                        position,
                        canvas.width,
                        canvasSection.height,
                        0,
                        0,
                        canvas.width,
                        canvasSection.height
                    );

                    const sectionImgData = canvasSection.toDataURL("image/png");
                    pdf.addImage(sectionImgData, "PNG", 0, 0, pdfWidth, (canvasSection.height * pdfWidth) / canvas.width);

                    position += canvasSection.height * (canvas.width / pdfWidth);
                    if (position < canvas.height) pdf.addPage(); // Thêm trang mới nếu còn nội dung
                }
            }

            // Tải file PDF xuống
            pdf.save(`invoice_${selectedInvoice?.id || "detail"}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    // const handleDownloadPDF = () => {
    //     const doc = new jsPDF();
    //     const invoice = selectedInvoice;
    //
    //     // Tạo tiêu đề của hóa đơn
    //     doc.setFontSize(16);
    //     doc.text("Hóa đơn chi tiết", 20, 20);
    //
    //     // Thông tin hóa đơn
    //     doc.setFontSize(12);
    //     doc.text(`ID: ${invoice.id}`, 20, 30);
    //     doc.text(`Người mua: ${invoice.user}`, 20, 40);
    //     doc.text(`Số điện thoại: ${invoice.phone}`, 20, 50);
    //     doc.text(`Địa chỉ: ${invoice.address}`, 20, 60);
    //     doc.text(`Số tiền: $${invoice.total}`, 20, 70);
    //     doc.text(`Trạng thái: ${invoice.bill_status !== "CHUA_THANH_TOAN" ? "Đã thanh toán" : "Chưa thanh toán"}`, 20, 80);
    //     doc.text(`Ngày tạo: ${new Date(invoice.dateTime).toLocaleDateString()}`, 20, 90);
    //
    //     // Danh sách sản phẩm
    //     doc.text("Danh sách sản phẩm:", 20, 100);
    //     invoice.products.forEach((product, index) => {
    //         const yPosition = 110 + index * 10;
    //         doc.text(`Mã sản phẩm: SP${product.product_id}`, 20, yPosition);
    //         doc.text(`Tên sản phẩm: ${product.name}`, 80, yPosition);
    //         doc.text(`Số lượng: ${product.quantity}`, 150, yPosition);
    //         doc.text(`Tổng tiền: $${product.price * product.quantity}`, 200, yPosition);
    //     });
    //
    //     // Lưu PDF
    //     doc.save(`invoice_${invoice.id}.pdf`);
    // };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Người mua",
            dataIndex: "user",
            key: "userName",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Số tiền",
            dataIndex: "total",
            key: "total",
            render: (total) => `$${total}`,
        },
        {
            title: (
                <div>

                    <Button
                        type="text"
                        icon={<FilterOutlined />}
                        onClick={toggleFilter}
                        style={{ marginLeft: "8px" ,outline:"none",border:"none"}}
                    >
                        Trạng thái
                        {/*{filterStatus === "CHUA_THANH_TOAN" ? "Chưa thanh toán" : "Đã thanh toán"}*/}
                    </Button>
                </div>
            ),
            dataIndex: "bill_status",
            key: "bill_status",
            render: (status) => `${status!=="CHUA_THANH_TOAN"?'Đã thanh toán':'Chưa thanh toán'}`,
        },
        {
            title: "Ngày tạo",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (dateTime) => `${new Date(dateTime).toLocaleDateString()}`,
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => showInvoiceDetails(record)}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            {/*<h2>Invoices Management</h2>*/}
            <Search
                placeholder="Search by name, email, payment method..."
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                style={{ marginBottom: "20px" }}
            />
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title={
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
                        Hóa đơn chi tiết
                    </div>
                }
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width ={"100%"}
                style={{
                    maxWidth:800,
                    width:"100%"
                }}
                bodyStyle={{
                    overflowY: 'auto', // Nếu nội dung dài hơn, sẽ cuộn
                }}
                footer={[
                    <Button key="download" type="primary" onClick={handleDownloadPDF}>
                        Tải PDF
                    </Button>,
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedInvoice ? (
                    <div id="invoice-detail-content" style={{ padding: "10px" }}>
                        <Descriptions column={1}>
                            <Descriptions.Item label="ID">{selectedInvoice.id}</Descriptions.Item>
                            <Descriptions.Item label="Người mua">{selectedInvoice.user}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{selectedInvoice.phone}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{selectedInvoice.address}</Descriptions.Item>
                            <Descriptions.Item label="Số tiền">{`$${selectedInvoice.total}`}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                {selectedInvoice.bill_status !== "CHUA_THANH_TOAN" ? "Đã thanh toán" : "Chưa thanh toán"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                {new Date(selectedInvoice.dateTime).toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>
                        <h3 style={{marginTop: "20px", marginBottom:"20px", display:"flex", justifyContent:"center", fontSize:"28px", fontWeight:"700"}}>Danh sách sản phẩm</h3>
                        <Table
                            columns={[
                                {
                                    title: "Mã",
                                    dataIndex: "product_id",
                                    key: "product_id",
                                    render: (id) => `SP${id}`,
                                },
                                {
                                    title: "Tên sản phẩm",
                                    dataIndex: "name",
                                    key: "name",
                                    render: (name,record) => <div style={{
                                        display:"flex",
                                        flexDirection:"column",
                                        marginTop:"12px",

                                    }}>
                                        <span>{name}</span>
                                        <span style={{color:"#1677FF"}}>{record.color ? `Phân loại: ${record.color}-${record.size}`:""}</span>
                                    </div>,
                                },
                                {
                                    title: "Số lượng",
                                    dataIndex: "quantity",
                                    key: "quantity",
                                },
                                {
                                    title: "Tổng tiền",
                                    dataIndex: "price",
                                    key: "price",
                                    render: (price,record) => `$${price*record.quantity}`,
                                },
                            ]}
                            dataSource={selectedInvoice.products || []}
                            rowKey="productId"
                            pagination={false}
                        />
                    </div>

                ) : (
                    <p>Không có dữ liệu chi tiết.</p>
                )}
            </Modal>
        </div>
    );
};

export default InvoiceUser;
