import axios from 'axios';  // Đảm bảo Axios đã được cài đặt
import { SERVER } from "../../environment.ts";

const imageUpload = async (file: File) => {
    try {
        // Tạo FormData và thêm file vào
        const formData = new FormData();
        formData.append("fileInput", file);

        // Gửi yêu cầu POST để upload file lên server
        const response = await axios.post<{ fileUrl: string }>(
            `http://localhost:3000/api/v1/files`,  // Đường dẫn API upload file (thay đổi theo server của bạn)
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",  // Đảm bảo gửi file theo định dạng multipart
                },
            }
        );

        // Trả về URL của ảnh đã upload
        console.log({response})
        return response.data?.fileUrl;  // Giả sử API trả về một đối tượng có trường `url` chứa đường dẫn ảnh
    } catch (error) {
        console.error("Upload file thất bại", error);
        return null;
    }
};

export  {imageUpload};
