import React, {useEffect, useMemo, useState} from "react";
import { Table, Button, Image, Input } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { Header } from "@/components/shared/header/index";

import { SearchOutlined } from '@ant-design/icons';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Product} from "../../service/product/product.ts";
import {Pagination} from "@/components/ui";  // Import useNavigate

interface IProduct {
  id: number;
  src: string; // type: ảnh nền
  code: string; // Mã sản phẩm
  title: string; // Tên sản phẩm
  category: string; // Phân loại
  price: number; // Giá sản phẩm
  sold: number; // Số lượng đã bán
  quantity: number; // Số lượng tồn kho
  rating: number; // Đánh giá (số sao)
}

const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const navigate = useNavigate();  // Hook điều hướng từ react-router-dom
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  // Dữ liệu giả lập
  const [searchParams, setSearchParams] = useSearchParams();

  const [filteredProducts,setFilteredProducts]=useState([])
  const isLoading: boolean = false;
  console.log({ filteredProducts });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms

    // Clear timeout nếu searchTerm thay đổi trước khi timeout kết thúc
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);



  useEffect(()=>{
    (async (page,key)=>{
      try {
        let params={
          limit:20,
          page:page,
        }
        if(key?.length>0 ){
          params={...params,key}
        }
        const response = await Product.searchListProduct(params)
        console.log("product: ", response)
        if(response.data.isSuccess===true){
          if(response.data?.data){
            setFilteredProducts(response.data.data?.content);
            setTotalPage(response.data.data.totalPages)
          }
          else {
            setFilteredProducts([])
          }
        }
      }catch(e){
        console.log(e);
        setFilteredProducts([])
      }
    })(page,debouncedSearchTerm)
  },[page,debouncedSearchTerm])

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại.");
    }
  };



  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      render: (images: string) => <Image src={images?.find(item=>item)?.url} alt="Product" width={50} style={{ display: 'block', margin: '0 auto' }} />,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productId',
      render: (text: string) => <span>SP{text.toString().padStart(3, '0')}</span>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'Phân loại',
      dataIndex: 'categoryName',
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      render: (text: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'sold',
      className: 'text-center',
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      className: 'text-center',
    },
    {
      title: 'Đánh giá (số sao)',
      dataIndex: 'rating',
      className: 'text-center',
    },
    {
      title: 'Tùy chỉnh',
      render: (record: IProduct) => (
          <>
            <Button
                type="primary"
                onClick={() => navigate(`/edit-product/${record.productId}`)} // Điều hướng đến trang chỉnh sửa sản phẩm
            >
              Sửa
            </Button>
            {/*<Button*/}
            {/*    type="primary"*/}
            {/*    danger*/}
            {/*    onClick={() => handleDelete(record.id)}*/}
            {/*    style={{ marginLeft: 8 }}*/}
            {/*>*/}
            {/*  Xóa*/}
            {/*</Button>*/}
          </>
      ),
      className: 'text-center',
    },
  ];

  return (
      <div className="container mx-auto p-4">
        <Header />
        <h1 className="text-center text-5xl font-bold mt-40 mb-4">Danh sách sản phẩm</h1>
        <Input
            placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, phân loại"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
            prefix={<SearchOutlined />}
        />
        <Table
            dataSource={filteredProducts}
            columns={columns}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: 'Không có dữ liệu' }}
        />
        <Pagination totalPages={totalPage} page={page} setPage={setPage} />
      </div>
  );
};

export default AdminProductList;
