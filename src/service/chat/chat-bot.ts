import {API} from "../api.ts";
import {IProduct} from "../../common/models/Product.ts";
import {SERVER} from "../../environment.ts";

const ChatApi= {
    // Hàm xử lý streaming response từ chatbot backend
    queryStream: async (question: string, onChunk: (chunk: string) => void, onComplete: () => void, onError: (error: any) => void) => {
        try {
            const url = `${SERVER.chat.url}/chat`;
            console.log('🔵 Calling chatbot API:', url);
            console.log('🔵 Request body:', { question });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            console.log('🔵 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔴 Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No reader available');
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    console.log('🟢 Stream completed');
                    break;
                }

                // Decode chunk
                buffer += decoder.decode(value, { stream: true });
                console.log('🔵 Buffer:', buffer);

                // Tách các dòng SSE (format: data:{...}\n)
                const lines = buffer.split('\n');

                // Xử lý tất cả các dòng đã hoàn chỉnh (trừ dòng cuối chưa đầy đủ)
                for (let i = 0; i < lines.length - 1; i++) {
                    let line = lines[i].trim();

                    if (!line) continue; // Bỏ qua dòng trống

                    console.log('🔵 Processing line:', line);

                    try {
                        // Bỏ prefix "data:" nếu có
                        if (line.startsWith('data:')) {
                            line = line.substring(5).trim(); // Bỏ "data:"
                        }

                        // Parse JSON
                        const data = JSON.parse(line);
                        console.log('🔵 Parsed data:', data);

                        // Kiểm tra nếu có chunk text
                        if (data.chunk !== undefined && data.chunk !== null) {
                            console.log('🟢 Chunk content:', data.chunk);
                            onChunk(data.chunk);
                        }

                        // Kiểm tra nếu done = true thì kết thúc
                        if (data.done === true) {
                            console.log('🟢 Stream done signal received');
                            onComplete();
                            return;
                        }

                        // Kiểm tra error
                        if (data.error !== null && data.error !== undefined) {
                            console.error('🔴 Error from backend:', data.error);
                            throw new Error(data.error);
                        }
                    } catch (e) {
                        console.error('🔴 Error parsing line:', e, 'Line:', line);
                    }
                }

                // Giữ lại dòng cuối chưa hoàn chỉnh trong buffer
                buffer = lines[lines.length - 1];
            }

            // Xử lý phần còn lại trong buffer
            if (buffer.trim()) {
                let line = buffer.trim();
                try {
                    if (line.startsWith('data:')) {
                        line = line.substring(5).trim();
                    }
                    const data = JSON.parse(line);
                    if (data.chunk !== undefined && data.chunk !== null) {
                        onChunk(data.chunk);
                    }
                    if (data.done === true) {
                        onComplete();
                        return;
                    }
                } catch (e) {
                    console.error('🔴 Error parsing final buffer:', e, 'Line:', line);
                }
            }

            onComplete();
        } catch (error) {
            console.error('🔴 Stream error:', error);
            onError(error);
        }
    },

    // Giữ lại hàm cũ cho compatibility (nếu cần)
    query: async (params) => {
        return await API.get<any>(
            SERVER.chat.url,
            `/ques/ask`,
            params,
            false,
        )
    },
}
export {ChatApi}