import React, { useEffect, useState } from "react";
import { Input, Button ,List } from "antd";
import { toast } from "react-toastify";
import { Header } from "@/components/shared/header/index";
import {Color, IColor} from "../../service/attributes/color.ts";
import {Category, ICategory} from "../../service/attributes/category.ts";
import {ISize, Size} from "../../service/attributes/size.ts";
import {ISeason, Season} from "../../service/attributes/Season.ts";
type AttributeValue = ICategory | ISize | ISeason | IColor|null|undefined
const ProductAttributes: React.FC = () => {
    const [attributes, setAttributes] = useState<{ name: string; values: AttributeValue[] }[]>([]);
    const [selectedAttribute, setSelectedAttribute] = useState<{ name: string; values: AttributeValue[] } | null>(null);
    const [newValues, setNewValues] = useState<string[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<{ value?: string; code?: string; name?: string; year?: string }>({});



    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const categories = await Category.getAll();
                const sizes = await Size.getAll();
                const seasons = await Season.getAll();
                const colors = await Color.getAll();

                setAttributes([
                    { name: "Danh mục", values: categories.data?.data?.content||[] },
                    { name: "Kích thước", values: sizes.data?.data||[] },
                    { name: "Mùa", values: seasons.data?.data?.content||[] },
                    { name: "Màu sắc", values: colors.data?.data||[] },
                ]);
                setSelectedAttribute({ name: "Danh mục", values: categories.data?.data?.content||[] });
            } catch (error) {
                toast.error("Không thể tải dữ liệu!");
            }
        };

        fetchAttributes();
    }, []);


    const handleSelectAttribute = (attribute: { name: string; values: AttributeValue[] } | null) => {
        setSelectedAttribute(attribute);
        setNewValues([]);
        setEditIndex(null);
    };

    const handleAddValue = () => {
        setNewValues([...newValues, ""]);
    };

    const handleChangeNewValue = (index: number, value: string) => {
        const updatedValues = [...newValues];
        updatedValues[index] = value;
        setNewValues(updatedValues);
    };

    const handleSave = async () => {
        if (selectedAttribute) {
            const newItems = newValues.filter((val) => val);
            console.log("eee",{selectedAttribute,newItems})
            // Validate dữ liệu
            for (const value of newItems) {
                if (selectedAttribute.name === "Màu sắc") {
                    const [colorValue, code] = value.split(",");
                    console.log("eee",{colorValue,code})
                    if (!colorValue || !code) {
                        toast.error("Vui lòng nhập đầy đủ Tên màu và Mã màu!");
                        return;
                    }
                    if (!/^#[0-9A-Fa-f]{6}$/.test(code.trim())) {
                        toast.error("Mã màu không hợp lệ! Vui lòng nhập mã màu dạng Hex, ví dụ: #FFFFFF.");
                        return;
                    }
                } else if (selectedAttribute.name === "Mùa") {
                    const [name, year] = value.split(",");
                    if (!name || !year) {
                        toast.error("Vui lòng nhập đầy đủ Tên mùa và Năm!");
                        return;
                    }
                    if (!/^\d{4}$/.test(year.trim())) {
                        toast.error("Năm không hợp lệ! Vui lòng nhập năm dạng số (VD: 2023).");
                        return;
                    }
                } else {
                    if (!value.trim()) {
                        toast.error("Giá trị không được để trống!");
                        return;
                    }
                }
            }

            try {
                // Thêm mới
                const createdItems: AttributeValue[] = [];
                if (selectedAttribute.name === "Danh mục") {
                    for (const value of newItems) {
                        const newCategory = await Category.create({ name:value });
                        createdItems.push(newCategory.data.data);
                    }
                } else if (selectedAttribute.name === "Kích thước") {
                    for (const value of newItems) {
                        const newSize = await Size.create({ value });
                        createdItems.push(newSize.data.data);
                    }
                } else if (selectedAttribute.name === "Mùa") {
                    for (const value of newItems) {
                        const [name, year] = value.split(",");
                        const newSeason = await Season.create({ name: name.trim(), year: year.trim() });
                        createdItems.push(newSeason.data.data);
                    }
                } else if (selectedAttribute.name === "Màu sắc") {
                    for (const value of newItems) {
                        const [colorValue, code] = value.split(",");
                        const newColor = await Color.create({ value: colorValue.trim(), code: code.trim() });
                        createdItems.push(newColor.data.data);
                    }
                }

                // Cập nhật giao diện
                const updatedAttributes = attributes.map((attr) =>
                    attr.name === selectedAttribute.name
                        ? { ...attr, values: [...attr.values, ...createdItems] }
                        : attr
                );

                setAttributes(updatedAttributes);
                setSelectedAttribute({
                    ...selectedAttribute,
                    values: [...selectedAttribute.values, ...createdItems],
                });
                setNewValues([]);
                toast.success("Thêm giá trị thành công!");
            } catch (error) {
                toast.error("Không thể thêm giá trị!");
            }
        }
    };




    const handleEditValue = (index: number) => {
        if (editIndex === index) {
            handleSaveEditValue(index);
        } else {
            const item = selectedAttribute?.values?.[index];
            if (selectedAttribute?.name === "Màu sắc" && item && "code" in item) {
                setEditValue({value: item?.value,code:item?.code });
            } else if (selectedAttribute?.name === "Mùa" && item && "year" in item) {
                setEditValue({name:item.name!,year:item.year!});
            } else if (selectedAttribute?.name === "Kích thước" && item && "value" in item) {
                setEditValue({ value: item.value });
            }
            else if (selectedAttribute?.name === "Danh mục" && item && "name" in item) {
                console.log("eee"," danh mcu")
                setEditValue({ name: item.name });
            }
            setEditIndex(index);
        }
    };

    const handleSaveEditValue = async (index: number) => {
        if (selectedAttribute && editIndex !== null) {
            const item = selectedAttribute.values[editIndex];
            console.log("eee",{item})
            const updatedItem = { ...item, ...editValue }; // Gộp giá trị đã chỉnh sửa
            console.log("eee",{editValue,updatedItem})
            try {
                if (selectedAttribute.name === "Danh mục") {
                    await Category.update(updatedItem as ICategory);
                } else if (selectedAttribute.name === "Kích thước") {
                    await Size.update( updatedItem as ISize);
                } else if (selectedAttribute.name === "Mùa") {
                    await Season.update(updatedItem as ISeason);
                } else if (selectedAttribute.name === "Màu sắc") {
                    await Color.update(updatedItem as IColor);
                }

                // Cập nhật giao diện
                const updatedAttributes = attributes.map((attr) => {
                        if (attr.name === selectedAttribute.name) {

                            const newData= ({
                                ...attr,
                                values:
                                    attr.values.map((val, idx) => {
                                            return idx === editIndex ? updatedItem : val
                                        }
                                    ),
                            })
                            setSelectedAttribute(newData)
                            return newData
                        } else {
                            return attr;
                        }
                    }

                );

                setAttributes(updatedAttributes);
                setEditIndex(null);
                setEditValue({});
                toast.success("Cập nhật giá trị thành công!");
            } catch (error) {
                toast.error("Không thể cập nhật giá trị!");
            }
        }
    };

    const handleRemoveValue = (index: number) => {
        if (selectedAttribute) {
            const updatedAttributes = attributes.map(attr =>
                attr.name === selectedAttribute.name
                    ? {
                        ...attr,
                        values: attr.values.filter((_, idx) => idx !== index)
                    }
                    : attr
            );
            setAttributes(updatedAttributes);
            toast.success("Xóa giá trị thành công!");
        }
    };

    const handleRemoveNewValue = (index: number) => {
        const updatedValues = newValues.filter((_, idx) => idx !== index);
        setNewValues(updatedValues);
    };
    console.log("eeem",{editValue})

    return (
        <div>
            <Header />
            <h1 className="text-center text-5xl font-bold mt-40 mb-4">Quản lý thuộc tính của sản phẩm</h1>
            <div className="flex p-5 mt-20">
                <div className="w-1/4">
                    <List
                        bordered
                        dataSource={attributes}
                        renderItem={item => (
                            <List.Item
                                onClick={() => handleSelectAttribute(item)}
                                className={`cursor-pointer ${selectedAttribute?.name === item.name ? 'bg-blue-100' : ''}`}
                            >
                                {item.name}
                            </List.Item>
                        )}
                        className="border-2 border-gray-300 rounded-lg"
                    />
                </div>
                <div className="w-3/4 pl-5">
                    <div className="border-2 border-gray-300 p-4 rounded-lg shadow-md mb-4">
                        {selectedAttribute ? (
                            <div>
                                <h2 className="text-center text-2xl font-bold mb-4">{selectedAttribute.name}</h2>
                                <div className="list-item-container">
                                    {selectedAttribute?.values?.map((value, index) => {
                                        const isColor = selectedAttribute.name === "Màu sắc";
                                        const isSeason = selectedAttribute.name === "Mùa";
                                        const isCategory = selectedAttribute.name === "Danh mục";

                                        // Tách giá trị ra theo cấu trúc (tùy thuộc vào API)
                                        const displayValue:AttributeValue =  value;
                                        console.log({displayValue})
                                        return (
                                            <div key={index} className="flex items-center mb-2">
                                                {isColor ? (
                                                displayValue &&
                                                <>
                                                        {/* Hiển thị ô nhập Tên màu */}
                                                        <Input
                                                            value={editIndex === index ? editValue?.value : displayValue?.value}
                                                            readOnly={editIndex !== index}
                                                            onChange={(e) =>
                                                                setEditValue({ ...editValue, value: e.target.value })
                                                            }
                                                            placeholder="Tên màu"
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        {/* Hiển thị ô nhập Mã màu */}
                                                        <Input
                                                            value={editIndex === index ? editValue.code : displayValue?.code}
                                                            readOnly={editIndex !== index}
                                                            onChange={(e) =>
                                                                setEditValue({ ...editValue, code: e.target.value })
                                                            }
                                                            placeholder="Mã màu (Hex)"
                                                            style={{ marginRight: 8 }}
                                                        />
                                                    </>
                                                ) : isSeason ? (
                                                        displayValue &&
                                                    <>
                                                        {/* Hiển thị ô nhập Tên mùa */}
                                                        <Input
                                                            value={editIndex === index ? editValue.name : displayValue?.name}
                                                            readOnly={editIndex !== index}
                                                            onChange={(e) =>
                                                                setEditValue({ ...editValue, name: e.target.value })
                                                            }
                                                            placeholder="Tên mùa"
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        {/* Hiển thị ô nhập Năm */}
                                                        <Input
                                                            value={editIndex === index ? editValue.year : displayValue?.year}
                                                            readOnly={editIndex !== index}
                                                            onChange={(e) =>
                                                                setEditValue({ ...editValue, year: e.target.value })
                                                            }
                                                            placeholder="Năm"
                                                            style={{ marginRight: 8 }}
                                                        />
                                                    </>
                                                ) :
                                                    isCategory? (
                                                    displayValue &&
                                                            // Mặc định hiển thị ô giá trị cho các thuộc tính khác
                                                        <Input
                                                            value={editIndex === index ? editValue?.name : displayValue?.name}
                                                            readOnly={editIndex !== index}
                                                            onChange={(e) => setEditValue({name:e.target.value})}
                                                            placeholder="Giá trị"
                                                            style={{ marginRight: 8 }}
                                                        />
                                                    )
                                                    :(
                                                    displayValue &&
                                                    // Mặc định hiển thị ô giá trị cho các thuộc tính khác
                                                    <Input
                                                        value={editIndex === index ? editValue?.value : displayValue?.value}
                                                        readOnly={editIndex !== index}
                                                        onChange={(e) => setEditValue({value:e.target.value})}
                                                        placeholder="Giá trị"
                                                        style={{ marginRight: 8 }}
                                                    />
                                                )}
                                                {/* Nút chỉnh sửa và lưu */}
                                                <Button
                                                    onClick={() => handleEditValue(index)}
                                                    className={`text-${editIndex === index ? "green" : "blue"}-500`}
                                                >
                                                    {editIndex === index ? "Lưu" : "Chỉnh sửa"}
                                                </Button>
                                                {/* Nút xóa */}
                                                {/*<Button onClick={() => handleRemoveValue(index)} className="text-red-500">*/}
                                                {/*    Xóa*/}
                                                {/*</Button>*/}
                                            </div>
                                        );
                                    })}


                                </div>
                                {newValues.map((value, index) => {
                                    const [input1, input2] = value.split(",");
                                    const isColor = selectedAttribute?.name === "Màu sắc";
                                    const isSeason = selectedAttribute?.name === "Mùa";
                                    const isCategory = selectedAttribute.name === "Danh mục";
                                    return (
                                        <div key={index} className="flex flex-col mb-4">
                                            <div className="flex items-center">
                                                {isColor ? (
                                                    <>
                                                        <Input
                                                            placeholder="Nhập tên màu"
                                                            value={input1 || ""}
                                                            onChange={(e) => handleChangeNewValue(index, `${e.target.value},${input2 || ""}`)}
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        <Input
                                                            placeholder="Nhập mã màu (Hex)"
                                                            value={input2 || ""}
                                                            onChange={(e) => handleChangeNewValue(index, `${input1 || ""},${e.target.value}`)}
                                                            style={{ marginRight: 8 }}
                                                        />
                                                    </>
                                                ) : isSeason ? (
                                                    <>
                                                        <Input
                                                            placeholder="Nhập tên mùa"
                                                            value={input1 || ""}
                                                            onChange={(e) => handleChangeNewValue(index, `${e.target.value},${input2 || ""}`)}
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        <Input
                                                            placeholder="Nhập năm"
                                                            value={input2 || ""}
                                                            onChange={(e) => handleChangeNewValue(index, `${input1 || ""},${e.target.value}`)}
                                                            style={{ marginRight: 8 }}
                                                        />
                                                    </>
                                                ) :isCategory? (
                                                    <Input
                                                        placeholder="Nhập giá trị mới"
                                                        value={value}
                                                        onChange={(e) => handleChangeNewValue(index, e.target.value)}
                                                        style={{ marginRight: 8 }}
                                                    />
                                                ): (
                                                    <Input
                                                        placeholder="Nhập giá trị mới"
                                                        value={value}
                                                        onChange={(e) => handleChangeNewValue(index, e.target.value)}
                                                        style={{ marginRight: 8 }}
                                                    />
                                                )}
                                                <Button onClick={() => handleRemoveNewValue(index)} className="text-red-500">
                                                    X
                                                </Button>
                                            </div>

                                            {/* Hiển thị thông báo lỗi */}
                                            {isColor && (!input1 || !input2 || !/^#[0-9A-Fa-f]{6}$/.test(input2.trim())) && (
                                                <span className="text-red-500 text-sm">Vui lòng nhập đúng tên và mã màu (VD: #FFFFFF).</span>
                                            )}
                                            {isSeason && (!input1 || !input2 || !/^\d{4}$/.test(input2.trim())) && (
                                                <span className="text-red-500 text-sm">Vui lòng nhập đúng tên mùa và năm (VD: Xuân,2023).</span>
                                            )}
                                        </div>
                                    );
                                })}


                                <div className="flex justify-center mt-4">
                                    <Button
                                        onClick={handleAddValue}
                                        className="w-full bg-gray-200 border border-gray-300 text-gray-700"
                                    >
                                        Thêm Giá Trị
                                    </Button>
                                </div>
                                {newValues?.length>0?<div className="flex justify-center mt-4">
                                    <Button type="primary" onClick={handleSave}>
                                        Lưu
                                    </Button>
                                </div>:''}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAttributes;
