import React, { useEffect, useState } from "react";
import {Table, Button, Image, Input, TablePaginationConfig, Modal} from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { Header } from "@/components/shared/header/index";
import { SearchOutlined } from '@ant-design/icons';
import getListUser from "../../service/user/getListUser.ts";
import {data} from "autoprefixer";
import {setUser} from "../../store/user-slice.ts";
import {Pagination} from "../../components/ui";
import changeActiveUser from "@/service/user/ChangeActiveUser.ts";

export interface User {
  id: number;
  avt: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  successful_orders: number;
  failed_orders: number;
}
export interface IDataListUser{
  total:number;
  totalPage:number;
  users:User[];
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<number | null>(null);


  const handleDelete = async (userId: number) => {
    try {
      // await axios.delete(`/api/users/${userId}`);
      await changeActiveUser({isActive:false},userId)
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Khóa người dùng thành công!");
    } catch (error) {
      toast.error("Khóa người dùng thất bại.");
    }
  };

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
        const response = await getListUser({
          limit:20,
          page:page-1,
          key:key.trim().length>0?key.trim():"",
          isActive:true
        })
        if(response.data.isSuccess===true){
          if(response.data?.data){
            setUsers(response.data.data.users);
            setTotalPage(response.data.data.totalPage)
          }
          else {
            setUsers([])
          }
        }
      }catch(e){
        console.log(e);
        setUsers([])
      }
    })(page,debouncedSearchTerm)
  },[page,debouncedSearchTerm])

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avt',
      render: (text: string) => <Image src={text} alt="User Avatar" width={50} style={{ display: 'block', margin: '0 auto' }} />,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      // className: 'text-center', // Thêm class căn giữa
    },
    // {
    //   title: 'Tổng số đơn hàng thành công',
    //   dataIndex: 'successful_orders',
    //   className: 'text-center', // Thêm class căn giữa
    // },
    // {
    //   title: 'Tổng số đơn hàng thất bại',
    //   dataIndex: 'failed_orders',
    //   className: 'text-center', // Thêm class căn giữa
    // },
    {
      title: 'Tùy chỉnh',
      render: (record: User) => (
        <Button 
          type="primary" 
          danger 
          onClick={() => showDeleteConfirm(record.id)}
        >
          Khóa
        </Button>
      ),
      className: 'text-center', // Thêm class căn giữa
    },
  ];
  const showDeleteConfirm = (userId: number) => {
    setConfirmDeleteUserId(userId);
  };
  const handleConfirmDelete = () => {
    if (confirmDeleteUserId) {
      handleDelete(confirmDeleteUserId);
      setConfirmDeleteUserId(null); // Reset after deletion
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-center text-5xl font-bold mt-40 mb-4">Danh sách người dùng đang hoạt động</h1>
      <Input 
        placeholder="Tìm kiếm theo họ tên, số điện thoại, email, tên tài khoản" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: 16 }} 
        prefix={<SearchOutlined />} // Thêm biểu tượng tìm kiếm
      />
      <Table 
        dataSource={users}
        columns={columns} 
        rowKey="id"
        pagination={false}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
      <Pagination totalPages={totalPage} page={page} setPage={setPage} />
      <Modal
          title="Xác nhận"
          visible={confirmDeleteUserId !== null}
          onOk={handleConfirmDelete}
          onCancel={() => setConfirmDeleteUserId(null)}
          okText="Xác nhận"
          cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn khóa tài khoản này không?</p>
      </Modal>
    </div>
  );
};

export default UserList;
