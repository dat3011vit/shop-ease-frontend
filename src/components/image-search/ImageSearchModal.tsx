import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { CameraOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { ImageSearchApi } from '@/service/image/image';
import ImageSearchResults from './ImageSearchResults';
import './index.scss';

interface ImageSearchModalProps {
    visible: boolean;
    onClose: () => void;
}

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ visible, onClose }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const file: UploadFile = {
                        uid: `-${Date.now()}`,
                        name: `pasted-image-${Date.now()}.png`,
                        status: 'done',
                        originFileObj: blob as any,
                    };
                    setFileList([file]);

                    // Create preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreviewImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(blob);

                    message.success('Đã dán ảnh thành công!');
                }
                break;
            }
        }
    };

    const handleUploadChange = (info: any) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1); // Only keep the latest file
        setFileList(newFileList);

        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(newFileList[0].originFileObj as File);
        } else {
            setPreviewImage('');
        }
    };

    const handleSearch = async () => {
        if (fileList.length === 0) {
            message.warning('Vui lòng chọn hoặc dán ảnh để tìm kiếm!');
            return;
        }

        setSearching(true);
        try {
            const file = fileList[0].originFileObj as File;
            console.log('🔍 Searching with image:', file.name);

            const response = await ImageSearchApi.searchByImage(file);
            console.log('✅ Search results:', response);

            // Xử lý response format: {data: Array, message: '', isSuccess: true}
            const results = response?.data || [];

            setSearchResults(results);
            setShowResults(true);
            message.success(`Tìm thấy ${results.length} sản phẩm tương tự!`);
        } catch (error) {
            console.error('❌ Search error:', error);
            message.error('Tìm kiếm thất bại. Vui lòng thử lại!');
        } finally {
            setSearching(false);
        }
    };

    const handleReset = () => {
        setFileList([]);
        setSearchResults([]);
        setShowResults(false);
        setPreviewImage('');
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CameraOutlined style={{ fontSize: '24px', color: '#FF6B35' }} />
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Tìm kiếm bằng hình ảnh</span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={showResults ? 1200 : 600}
            className="image-search-modal"
            closeIcon={<CloseOutlined style={{ fontSize: '18px' }} />}
        >
            {!showResults ? (
                <div className="image-search-upload" onPaste={handlePaste}>
                    <div className="upload-hint">
                        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                            📸 Tải lên hoặc dán (Ctrl+V) ảnh sản phẩm để tìm kiếm
                        </p>
                    </div>

                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Preview" />
                        </div>
                    )}

                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        accept="image/*"
                        maxCount={1}
                        className="image-upload"
                    >
                        {fileList.length === 0 && (
                            <div>
                                <UploadOutlined style={{ fontSize: '32px', color: '#FF6B35' }} />
                                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                            </div>
                        )}
                    </Upload>

                    <div className="upload-actions">
                        <Button
                            onClick={handleReset}
                            disabled={fileList.length === 0}
                            style={{ marginRight: '10px' }}
                        >
                            Đặt lại
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            loading={searching}
                            disabled={fileList.length === 0}
                            style={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                                border: 'none',
                            }}
                        >
                            {searching ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="image-search-results-container">
                    <div className="results-header">
                        <h3>Kết quả tìm kiếm ({searchResults.length} sản phẩm)</h3>
                        <Button
                            onClick={handleReset}
                            style={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                                border: 'none',
                                color: '#fff',
                            }}
                        >
                            Tìm kiếm lại
                        </Button>
                    </div>
                    <ImageSearchResults products={searchResults} />
                </div>
            )}
        </Modal>
    );
};

export default ImageSearchModal;
