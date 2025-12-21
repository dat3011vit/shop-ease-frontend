import axios from 'axios';  // Đảm bảo Axios đã được cài đặt
import { SERVER } from "../../environment.ts";

const imageUpload = async (file: File) => {
    try {
        // Tạo FormData và thêm file vào
        const formData = new FormData();
        formData.append("fileInput", file);

        // Gửi yêu cầu POST để upload file lên server
        const response = await axios.post<{ fileUrl: string }>(
            `http://localhost:7081/api/upload/image`,  // Đường dẫn API upload file (thay đổi theo server của bạn)
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

const ImageSearchApi = {
    /**
     * Tìm kiếm sản phẩm bằng hình ảnh
     * @param imageFile - File ảnh cần tìm kiếm
     */
    searchByImage: async (imageFile: File) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            console.log('🔵 Calling visual search API:', `${SERVER.product.url}/visual-search`);

            const response = await fetch(`${SERVER.product.url}/visual-search`, {
                method: 'POST',
                body: formData,
            });

            console.log('🔵 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔴 Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('🟢 Visual search result:', data);

            return data;
        } catch (error) {
            console.error('🔴 Visual search error:', error);
            throw error;
        }
    },
};

export  {imageUpload, ImageSearchApi};
