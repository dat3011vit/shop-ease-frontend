import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { Header } from "@/components/shared/header/index";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Container } from "../../components/shared";
import { imageUpload } from "../../service/image/image.ts";
import createProduct from "../../service/product/createProduct.ts";

const { Option } = Select;
type SizeQuantityMap = { [size: string]: { stock: number; color_id: number; size_id: number } };
type SelectedColors = { [color: string]: SizeQuantityMap };


const AddProduct: React.FC = () => {
  const { sizes: sizeOptions, colors: colorOptions, categories: categoryOptions, seasons: seasonOptions } = useSelector(
      (state: RootState) => state.attribute
  );
  const [form] = Form.useForm();
  const [src, setSrc] = useState<{ type: "new"; data: string; file: File }[]>([]);
  const [selectedColors, setSelectedColors] = useState<SelectedColors>({});
  // const [activeColors, setActiveColors] = useState<string[]>([]);

  const handleImageChange = (file: File, index: number) => {
    const newSrc = [...src];
    const temporaryUrl = URL.createObjectURL(file);
    newSrc[index] = { type: "new", data: temporaryUrl, file };
    setSrc(newSrc);
  };
  const handleImageRemove = (index: number) => {
    const newSrc = [...src];
    newSrc[index] = null;
    setSrc(newSrc);
  };

  const handleSizeChange = (color: string, size: string, quantity: { stock: number; size_id: number; color_id: number }) => {
    setSelectedColors((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: quantity,
      },
    }));
  };
  const uploadImagesToServer = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const urlrsp = await imageUpload(files[i]);
      if (urlrsp !== null) {
        uploadedUrls.push(urlrsp);
      }
    }
    return uploadedUrls;
  };

  const onFinish = async (values) => {
    try {
      const newFiles = src.filter((item) => item.type === "new").map((item) => item.file);
      const uploadedUrls = await uploadImagesToServer(newFiles);

      const allUrls = src.map((item) =>
          item.type === "new" ? uploadedUrls.shift() : item.data
      );

      const images = allUrls.map((url, index) => ({
        url,
        name: index === 0 ? "ANH_NEN" : `ANH_CHI_TIET${index}`,
        typeImage: index === 0 ? "ANH_NEN" : "ANH_CHI_TIET",
      }));

      const payload = {
        ...values,
        images,
        csq: Object.entries(selectedColors).flatMap(([color, sizes]) => {
          console.log("nau",sizes)
              return Object.entries(sizes).map(([size, quantity]) => ({
                color:colorOptions?.find(item=>item.id===quantity.color_id)?.value ,
                // size: quantity.size_id,
                code: colorOptions?.find(item=>item.id===quantity.color_id)?.code ,
                quantity: quantity.stock,
              }))
            }
        ),
        description: JSON.stringify(values?.description?.split("\n")),
        label:(values?.label?.trim()?.split(/\s*,\s*/))||[],
        season_id:values?.season,
        title:values?.title,
        price:values.price,
        category:values.category,
      };

      await createProduct(payload);
      message.success("Tạo sản phẩm thành công!");
      // form.resetFields();
      setSrc([]);
      setSelectedColors({});
    } catch (error) {
      message.error("Tạo sản phẩm thất bại.");
      console.error(error);
    }
  };



  // Cập nhật khi thay đổi màu
  const handleColorChange = (value: string[]) => {
    console.log("nau-va",value)
    const newSelectedColors: SelectedColors = { ...selectedColors };
    Object.keys(newSelectedColors).forEach((color) => {
      if (!value.includes(color)) {
        delete newSelectedColors[color];
      }
    });
    value.forEach((color) => {
      if (!newSelectedColors[color]) {
        newSelectedColors[color] = {};
      }
    });
    setSelectedColors(newSelectedColors);
  };

  return (
    <div className="flex flex-col items-center">
      <Header />
      <h1 className="text-center text-5xl font-bold mt-40 mb-4">Tạo sản phẩm mới</h1>

      <div className="flex w-full mt-5">
        <Form form={form} onFinish={onFinish} className="flex w-full">
          {/* Phần thêm hình ảnh */}
          <div className="w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Thêm Ảnh Bìa</h2>
            <Form.Item
              name="coverImage"
              rules={[{ required: true, message: "Vui lòng thêm ảnh bìa!" }]}
            >
              <div className="border border-gray-300 rounded-lg h-96 w-1/3 flex items-center justify-center mb-4">
                {src[0] ? (
                  <>
                    <img
                      src={src[0].data || ""}
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
                      handleImageChange(file as File,0);
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
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg h-96 flex items-center justify-center relative">
                    {src[index + 1] ? (
                      <>
                        <img
                          src={src?.[index + 1]?.data}
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
          <div className="w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Thông Tin Sản Phẩm</h2>
            {/*<Form.Item label="Mã sản phẩm" name="code" rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}>*/}
            {/*  <Input />*/}
            {/*</Form.Item>*/}
            <Form.Item label="Tên sản phẩm" name="title" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
              <Input type="number" />
            </Form.Item>
            {/*<Form.Item label="Khuyến mãi (%)" name="discount">*/}
            {/*  <Input type="number" placeholder="Nhập tỷ lệ khuyến mãi" />*/}
            {/*</Form.Item>*/}
            <Form.Item label="Label" name="label" rules={[{ required: true, message: "Vui lòng nhập label!" }]}>
              <Input />
            </Form.Item>
            <Form.Item
                label="Mùa"
                name="season"
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
            <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select>
                {categoryOptions.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Combobox cho Màu sắc */}
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

            {/* Hiển thị kích thước cho các màu đã chọn */}
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
                    {sizeOptions.map((size) => (
                        selectedColors[color][size.value] !== undefined && (
                            <div key={size.id} className="flex items-center ml-6">
                              <span className="mr-2">{size.value}:</span>
                              <Input
                                  type="number"
                                  min={0}
                                  placeholder="SL"
                                  className="w-32"
                                  onChange={(e) => handleSizeChange(color, size.value, {stock:parseInt(e.target.value, 10) || 0,color_id:selectedColors[color][size.value]?.color_id,size_id:selectedColors[color][size.value]?.size_id})}  // Chuyển đổi sang number
                                  value={selectedColors[color][size.value]?.stock || 0}
                              />

                            </div>
                        )
                    ))}
                  </div>
                </Form.Item>
            ))}
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea style={{ height: "100px" }} />
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Nút thêm sản phẩm */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="mt-4" onClick={form.submit}>
          Thêm Sản Phẩm
        </Button>
      </Form.Item>
    </div>
  );
};

export default AddProduct;
