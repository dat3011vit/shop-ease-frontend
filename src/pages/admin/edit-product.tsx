import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { Header } from "@/components/shared/header/index";
import axios from 'axios';
import {useParams} from "react-router-dom";
import getDetailProduct from "../../service/product/getDetailProduct.ts";
import {imageUpload} from "../../service/image/image.ts";
import updateProduct from "../../service/product/updateProduct.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Container} from "../../components/shared";

const { Option } = Select;

// const sizeOptions = ["OverSize", "S", "M", "L", "XL"];
// const colorOptions = ["Đỏ", "Tím", "Vàng"];
// const seasonOptions = [
//   { id: 1, name: "Xuân" },
//   { id: 2, name: "Hạ" },
//   { id: 3, name: "Thu" },
//   { id: 4, name: "Đông" },
// ];
// const categoryOptions = [
//   { id: 1, name: "Áo" },
//   { id: 2, name: "Quần" },
//   { id: 3, name: "Váy" },
// ];

// Dữ liệu giả lập sản phẩm
const mockProduct = {
  code: "SP12345",  // Mã sản phẩm cố định
  title: "Áo thun nam",
  price: 100000,
  season: "Hạ",
  category: "Áo",
  hagtag: "#ao",
  description: "Áo thun nam chất liệu cotton, thoáng mát, thoải mái.",
  discount: 10,
  coverImage: "https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg",  // Ảnh bìa giả lập
  otherImages: [
    "https://via.placeholder.com/150/FF0000",  // Ảnh 1
    "https://via.placeholder.com/150/00FF00",  // Ảnh 2
  ],
  colors: {
    "Đỏ": { "S": 5, "M": 8, "L": 2 },
    "Tím": { "S": 5, "M": 2 }
  }
};

// Các kiểu dữ liệu dùng trong mã
interface ImageItem {
  type: "db" | "new"; // Loại ảnh: từ DB hay mới upload
  data: string;       // URL của ảnh (URL thực hoặc tạm thời)
  file?: File;        // File ảnh (chỉ áp dụng cho ảnh mới)
}
type SizeQuantityMap = { [size: string]: { stock:number;color_id:number;size_id:number; } };  // Mỗi màu có một đối tượng với key là kích thước, value là số lượng
type SelectedColors = { [color: string]: SizeQuantityMap };  // Dựng đối tượng màu và các kích thước cho màu đó

const EditProduct: React.FC = () => {
  const { sizes:sizeOptions,colors:colorOptions,categories:categoryOptions, seasons:seasonOptions}= useSelector((state:RootState)=>state.attribute)
  const { id } = useParams(); // Lấy id từ URL
  console.log("ID:", id);
  const [form] = Form.useForm();
  const [src, setSrc] = useState<ImageItem[]>([]); // Chuyển từ images thành src
  const [selectedColors, setSelectedColors] = useState<SelectedColors>({});
  function groupByColor(csqs) {
    const result = {};

    csqs.forEach(item => {
      const color = item.color; // Màu sắc
      const size = item.size; // Kích cỡ
      const stock = item.quantity; // Số lượng tồn kho
      const color_id=item.color_id;
      const size_id=item.size_id;

      if (!result[color]) {
        result[color] = {}; // Khởi tạo đối tượng cho màu sắc nếu chưa tồn tại
      }

      // Cập nhật số lượng tồn kho cho kích cỡ
      result[color][size] = {stock,color_id,size_id};
    });

    return result;
  }
  const formatDescription = (descArray) => {
    if (Array.isArray(descArray)) {
      return descArray.join("\n"); // Nối các phần tử với ký tự xuống dòng
    }
    return descArray || ""; // Nếu không phải mảng, trả về chuỗi ban đầu
  };
  function jsonString(str) {
    if (typeof str !== "string") return null;
    try {
      JSON.parse(str);
      return   JSON.parse(str);
    } catch {
      return null;
    }
  }

  useEffect(() => {
   const fetchData=async(id)=>{
     const rsp = await getDetailProduct({productId:id});
     if(rsp?.data?.data){
       const product =rsp.data.data;
      const colors = groupByColor(product?.csq)
       console.log({x:Object.keys(colors)})
       const category = categoryOptions.find((c) => c.id === product.categoryId)?.id;
       // Tìm mùa hiện tại dựa trên ID
       const season = seasonOptions.find((s) => s.id === product.seasonId)?.id;
       form.setFieldsValue({
         code: product.code,
         title: product.title,
         price: product.price,
         season_id: product.season_id,
         category: product.category,
         label:Array.isArray(product?.label)?product?.label?.join(', '):'',
         description: formatDescription(jsonString(product.description)),
         sale: product?.sale||0,
         hagtag: product.hagtag,
         colors: Object.keys(colors),  // Đồng bộ với các màu sắc đã chọn
         sizes: colors  // Đồng bộ với kích thước của từng màu
       });
       setSelectedColors(colors);
       if (product?.images) {
         const initialSrc = product.images.map((item) => ({
           type: "db",    // Loại ảnh từ database
           data: item.url // URL của ảnh
         }));
         setSrc(initialSrc); // Cập nhật src ban đầu
       }

     }
   }
   if(id){
     fetchData(id)
   }
    // const product = mockProduct;
    // setSrc([product.coverImage, ...product.otherImages]);

  }, [id]);

  const handleImageChange = (file: File, index: number) => {
    const newSrc = [...src];
    const temporaryUrl = URL.createObjectURL(file); // Tạo URL tạm thời để hiển thị

    // Cập nhật ảnh tại vị trí index
    newSrc[index] = { type: "new", data: temporaryUrl, file };

    setSrc(newSrc);
  };

  const handleImageRemove = (index: number) => {
    const newSrc = [...src];
    newSrc[index] = null;
    setSrc(newSrc);
  };

  const handleSizeChange = (color: string, size: string, quantity: {
    stock:number;
    size_id:number;
    color_id:number
  }) => {
    setSelectedColors((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: quantity, // Cập nhật số lượng cho từng kích thước của màu cụ thể
      },
    }));
  };
  const uploadImagesToServer = async (files: File[]) => {
    if (files.length === 0) {
      return [];
    }

      const uploadedUrls: string[] = [];

      // Tải ảnh từng cái một
      for (let i = 0; i < files.length; i++) {
        const urlrsp=await imageUpload(files[i])
        if(urlrsp!==null){
          uploadedUrls.push(urlrsp);
        }

      }

      return uploadedUrls;

  };
  const onFinish = async (values) => {
    try {
      // Lọc ảnh mới và ảnh cũ
      const newFiles = src.filter((item) => item.type === "new").map((item) => item.file);
      // const existingUrls = src.filter((item) => item.type === "db").map((item) => item.data);

      // Upload ảnh mới lên server
      const uploadedUrls = await uploadImagesToServer(newFiles);

      // Ghép danh sách URL ảnh (bao gồm ảnh cũ và ảnh mới đã upload)
      const allUrls = src.map((item) =>
          item.type === "db" ? item.data : uploadedUrls.shift()
      );

      // Chuyển đổi images sang đúng định dạng với logic cho 'name' và 'Type_Image'
      const images = allUrls.map((url, index) => ({
        url,
        name: index === 0 ? "ANH_NEN" : `ANH_CHI_TIET${index}`,  // Chỉ định 'name' dựa trên vị trí ảnh
        typeImage: index === 0 ? "ANH_NEN" : "ANH_CHI_TIET"     // Chỉ định 'Type_Image' dựa trên vị trí ảnh
      }));

      // Cập nhật payload cho API
      const payload = {
        ...values,
        images,
        productId:id,
        csq: Object.entries(selectedColors).flatMap(([color, sizes]) => {
              console.log("nau",sizes)
              return Object.entries(sizes).map(([size, quantity]) => ({
                color:colorOptions?.find(item=>item.id===quantity.color_id)?.value ,
                size:sizeOptions?.find(item=>item.id===quantity.size_id)?.value  ,
                code: colorOptions?.find(item=>item.id===quantity.color_id)?.code ,
                quantity: quantity.stock,
              }))
            }
        ),
        description: JSON.stringify(values?.description?.split("\n")),
        label:(values?.label?.trim()?.split(/\s*,\s*/))||[],
        season_id:values?.season_id,
        title:values?.title,
        price:values.price,
        category:values.category,
      };

      // Gửi dữ liệu lên server
      // await axios.put("/api/products", payload, {
      //   headers: { "Content-Type": "application/json" },
      // });
      try{
        await updateProduct(payload)
        message.success("Cập nhật sản phẩm thành công!");
        // form.resetFields(); // Reset form
        // setSrc([]); // Reset ảnh
        // setSelectedColors({});
      }catch (e){
        console.log(e)
      }

      // message.success("Cập nhật sản phẩm thành công!");
      // form.resetFields(); // Reset form
      // setSrc([]); // Reset ảnh
      // setSelectedColors({}); // Reset màu sắc
    } catch (error) {
      message.error("Cập nhật sản phẩm thất bại.");
      console.error(error);
    }
  };



  const handleColorChange = (value: string[]) => {
    const newSelectedColors: SelectedColors = { ...selectedColors };

    // Loại bỏ các màu không còn được chọn
    Object.keys(newSelectedColors).forEach((color) => {
      if (!value.includes(color)) {
        delete newSelectedColors[color];
      }
    });

    // Thêm các màu mới vào selectedColors
    value.forEach((color) => {
      if (!newSelectedColors[color]) {
        newSelectedColors[color] = {}; // Khởi tạo object cho mỗi màu mới
      }
    });

    setSelectedColors(newSelectedColors);
  };

  console.log("color",sizeOptions)
  return (
    <div className="flex flex-col items-center">
      <Header />
<Container>
      <h1 className="text-center text-5xl font-bold mt-40 mb-4">Chỉnh Sửa Sản Phẩm</h1>
      <div className="flex w-full mt-5">
        <Form form={form} onFinish={onFinish} className="flex w-full">
          {/* Phần thêm hình ảnh */}
          <div className="w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Ảnh Bìa</h2>
            <Form.Item
              name="coverImage"
              validateStatus={!src[0] ? "error" : ""}
              help={!src[0] ? "Vui lòng thêm ảnh bìa!" : ""}
            >
              <div className="border border-gray-300 rounded-lg h-96 w-1/3 flex items-center justify-center mb-4 relative">
                {src[0] ? (
                  <>
                    <img
                      src={src[0].data||""}
                      alt="Ảnh bìa"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <span
                      onClick={() => handleImageRemove(0)}
                      className="absolute top-1 right-1 text-black cursor-pointer text-xl"
                    >
                      X
                    </span>
                  </>
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleImageChange(file as File, 0);
                      return false;
                    }}
                  >
                    <div className="flex items-center justify-center w-full h-full cursor-pointer">
                      <div className="flex items-center justify-center w-16 h-16 border border-dashed border-gray-300 rounded-lg">
                        <span className="text-2xl">+</span>
                      </div>
                    </div>
                  </Upload>
                )}
              </div>
            </Form.Item>

            <h2 className="text-2xl font-bold mb-4 mt-10">Thêm Các Ảnh Khác</h2>
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-5">
                {src?.slice(1)?.map((item,index) => (
                  <div key={index} className="border border-gray-300 rounded-lg h-96 flex items-center justify-center relative">
                    {item  ? (
                      <>
                        <img
                          src={item.data?? ""}  // Nếu src[index + 1] là null, thay thế bằng chuỗi rỗng ""
                          alt={`Product Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />

                        <span
                          onClick={() => handleImageRemove(index + 1)}
                          className="absolute top-1 right-1 text-black cursor-pointer text-xl"
                        >
                          X
                        </span>
                      </>
                    ) : (
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          handleImageChange(file as File, index + 1);
                          return false;
                        }}
                      >
                        <div className="flex items-center justify-center w-full h-full cursor-pointer">
                          <div className="flex items-center justify-center w-16 h-16 border border-dashed border-gray-300 rounded-lg">
                            <span className="text-2xl">+</span>
                          </div>
                        </div>
                      </Upload>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phần thông tin sản phẩm */}
          <div className="w-1/2 px-5">
            {/*<Form.Item label="Mã sản phẩm" name="code" >*/}
            {/*  <Input disabled />*/}
            {/*</Form.Item>*/}
            <Form.Item label="Tên sản phẩm" name="title" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Giảm giá" name="sale">
              <Input type="number" />
            </Form.Item>
            {/*<Form.Item label="Hagtag" name="hagtag" rules={[{ required: true, message: "Vui lòng nhập hagtag!" }]}>*/}
            {/*  <Input />*/}
            {/*</Form.Item>*/}
            <Form.Item label="Label" name="label" rules={[{ required: true, message: "Vui lòng nhập label!" }]}>
              <Input />
            </Form.Item>
            <Form.Item
                label="Mùa"
                name="season_id"
                rules={[{ required: true, message: "Vui lòng chọn mùa!" }]}
            >
              <Select>
                {seasonOptions.map((season) => (
                    <Option key={season.id} value={season.id}>
                      {season.name}
                    </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}>
              <Select>
                {categoryOptions.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Phần chọn màu */}
            <Form.Item label="Màu sắc" name="colors">
              <Select
                mode="multiple"
                value={Object.keys(selectedColors)}
                onChange={handleColorChange}
              >
                {colorOptions.map((color) => (
                  <Option key={color.id} value={color.value}>{color.value}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* Phần thêm kích thước cho từng màu */}
            {Object.keys(selectedColors).map((color) => (
              <Form.Item label={`Kích thước cho ${color}`} key={color} name="sizes">
                <Select
                  mode="multiple"
                  placeholder="Chọn kích thước"
                  value={Object.keys(selectedColors[color])}
                  onChange={(sizes) => {
                    console.log("sieu size",sizes,selectedColors)
                    const newSizes = sizes.reduce((acc, sizeValue) => {
                      const selectedSize = sizeOptions.find((size) => size.value === sizeValue);
                      const colorId =colorOptions?.find((colorOption) => colorOption.value === color).id;
                      if (selectedSize) {
                        acc[sizeValue] = {
                          stock: selectedColors[color]?.[sizeValue]?.stock || 0,
                          color_id:colorId || null,
                          size_id: selectedSize.id || null,
                        };
                      }
                      return acc;
                    }, {} as SizeQuantityMap);
                    setSelectedColors((prev) => ({
                      ...prev,
                      [color]: newSizes,
                    }));
                  }}
                >
                  {sizeOptions.map((size) => (
                    <Option key={size.id} value={size.value}>{size.value}</Option>
                  ))}
                </Select>
                <div className="flex flex-wrap gap-4 mt-6">
                {sizeOptions.map((size) => {
                  return(
                      selectedColors[color][size.value] !== undefined && (
                          <div key={size.id} className="flex items-center ml-6">
                            <span className="mr-2">{size.value}:</span>
                            <Input
                                type="number"
                                min={0}
                                placeholder="SL"
                                className="w-32"
                                onChange={(e) => handleSizeChange(color, size.value, {
                                  stock: parseInt(e.target.value, 10) || 0,
                                  color_id: selectedColors[color][size.value]?.color_id,
                                  size_id: selectedColors[color][size.value]?.size_id
                                })}  // Chuyển đổi sang number
                                value={selectedColors[color][size.value]?.stock || 0}
                            />

                          </div>
                      )
                  )
                })
                }
                </div>
              </Form.Item>
            ))}
            
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>
        </Form>
      </div>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="mt-4" onClick={form.submit}>
          Cập Nhật
        </Button>
      </Form.Item>
</Container>
    </div>
  );
};

export default EditProduct;
